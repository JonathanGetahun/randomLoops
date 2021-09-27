import { IntroWhisper, PubmedWhisper, BmiWhisper } from './whispers';
import {
  clipboardListener,
  filesystemExample,
  keyboardListener,
  networkExample,
  searchListener,
  activeWindowListener,
  pubmedListener,
} from './aptitudes';

// clipboardListener.listen();
// filesystemExample.run();
// keyboardListener.listen();
// networkExample.run();
// searchListener.listen();
// activeWindowListener.listen();
pubmedListener.listen();

new BmiWhisper().show();
new IntroWhisper().show();
new PubmedWhisper().instructions();
