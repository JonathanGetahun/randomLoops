import { network, clipboard } from '@oliveai/ldk';
import { oneLine } from 'common-tags';

import { PubmedWhisper } from '../../whispers';

const handler = async (text) => {
  const keyRequest = {
    method: 'GET',
    url: oneLine`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=${text}&retmax=3&2021[pdat]`,
  };
  const results = await network.httpRequest(keyRequest);
  const decodedBody = await network.decode(results.body);
  const parsedObject = JSON.parse(decodedBody);
  const articles = parsedObject;

  const whisper = new PubmedWhisper(articles);
  whisper.show();
};

const listen = () => {
  clipboard.listen(false, handler);
};

export { handler };
export default { listen };
