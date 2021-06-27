import axios from 'axios';

const WOOK_REGEX = /<script type="application\/ld\+json">[^]*?({[^]+})[^]*?<\/script>[^]*?<!-- Fim Google/;

const getPublisherData = (publisher: string, wookId: string) => {
  switch (publisher) {
    case 'Porto Editora':
      return {
        publisher,
        provider: 'Porto Editora',
        publisherUrl: `www.portoeditora.pt/produtos/ficha/${wookId}`,
      };
    case 'Areal Editores':
      return {
        publisher,
        provider: 'Porto Editora',
        publisherUrl: `www.arealeditores.pt/produtos/ficha/${wookId}`,
      };
    case 'Raiz Editora / Lisboa Editora':
      return {
        publisher,
        provider: 'Porto Editora',
        publisherUrl: `www.raizeditora.pt/produtos/ficha/${wookId}`,
      };
    default:
      return { publisher, provider: publisher };
  }
};

const getBookCodeFromPEGroup = async (publisherUrl: string) => {
  try {
    const { data } = await axios.get(`https://${publisherUrl}`);
    return {
      codePe:
        data.match(
          /<span class="text-label">Código:<\/span>[\s\n]*<span class="text-value">(\d{4,5})<\/span>/
        )?.[1] || '',
    };
  } catch (e) {
    return {};
  }
};

const getBookType = (response: string, title: string) => {
  if (response.indexOf('<span class="categoria">Escolar</span>') === -1)
    return { type: 'other', schoolYear: '' };

  const nameSplit = title.split(' - ');
  const typeIndex = nameSplit.findIndex((text) =>
    [
      'caderno de atividades',
      'workbook',
      "student's file",
      "cahier d'exercices",
      'cuaderno de ejercicios',
      'caderno prático',
      'caderno de autoavaliação',
      'livro de fichas',
      'fichas de consolidação',
      'livro de tarefas',
      'cardeno de fichas',
    ].some((v) => text.toLowerCase().trim().includes(v))
  );
  const type = typeIndex === -1 ? 'manual' : 'ca';
  const schoolYearIndex = nameSplit.findIndex((text) =>
    text.toLowerCase().trim().includes('º ano')
  );
  const schoolYear =
    schoolYearIndex === -1
      ? ''
      : nameSplit[schoolYearIndex].trim().replace(/\.?º ano/i, '');
  return { type, schoolYear };
};

export const getMetadataByURL = async (url: string) => {
  try {
    const response = await axios.get(url);

    const dataString = WOOK_REGEX.exec(response.data)?.[1];
    if (!dataString) return false;
    const bookMetadata = JSON.parse(dataString);
    let metadata = {
      isbn: bookMetadata.isbn.replace(/-/g, ''),
      name: bookMetadata.name,
      ...getPublisherData(
        bookMetadata.publisher?.name,
        response.request.path.split('/').pop()
      ),
      ...getBookType(response.data, bookMetadata.name),
    };
    if (metadata?.provider === 'Porto Editora' && metadata.publisherUrl)
      metadata = {
        ...metadata,
        ...(await getBookCodeFromPEGroup(metadata.publisherUrl)),
      };
    return metadata;
  } catch (e) {
    return false;
  }
};

export const getMetadata = async (isbn: string) =>
  getMetadataByURL(
    `https://www.wook.pt/pesquisa/${encodeURIComponent(isbn).replace(' ', '+')}`
  );

export default getMetadata;
