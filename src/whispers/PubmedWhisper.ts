import { whisper } from '@oliveai/ldk';

type Article = {
  [key: string]: any;
};
interface Props {
  articles: Article;
}
export default class PubmedWhisper {
  whisper: whisper.Whisper;

  label: string;

  props: Props;

  constructor(articles?: Article) {
    this.whisper = undefined;
    this.label = 'PubMed Whisper Fired';
    this.props = {
      articles,
    };
  }

  createInstructions() {
    const instruction: string = `This Loop is triggered when you select and copy a word. It searches the National Center for Biotechnology Information (NCBI) for the top 3 PubMed articles written in the current year associated with that word and returns the links to those articles.`;

    const message: whisper.Message = {
      type: whisper.WhisperComponentType.Message,
      body: instruction,
    };

    return [message];
  }

  instructions() {
    whisper
      .create({
        components: this.createInstructions(),
        label: this.label,
        onClose: PubmedWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  createComponents() {
    const url = 'https://pubmed.ncbi.nlm.nih.gov/';
    const articleKeys: string[] = this.props.articles?.esearchresult?.idlist;
    const components = [];
    articleKeys.forEach((article) => {
      components.push({
        type: whisper.WhisperComponentType.Message,
        body: `${url}${article}`,
      });
    });

    return components;
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: PubmedWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  close() {
    this.whisper.close(PubmedWhisper.onClose);
  }

  static onClose(err?: Error) {
    if (err) {
      console.error('There was an error closing Network whisper', err);
    }
    console.log('Network whisper closed');
  }
}
