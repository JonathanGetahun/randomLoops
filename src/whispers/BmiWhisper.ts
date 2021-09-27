import { whisper } from '@oliveai/ldk';
import { stripIndent } from 'common-tags';

interface Props {
  height: any;
  weight: any;
  bmi: any;
  category: string;
  unit: string;
}

export default class BmiWhisper {
  whisper: whisper.Whisper;

  label: string;

  props: Props;
  constructor() {
    this.whisper = undefined;
    this.label = 'BMI Whisper';
    this.props = {
      height: 0,
      weight: 0,
      bmi: 0,
      category: undefined,
      unit: 'Metric',
    };
  }

  createComponents() {
    const instructions: whisper.Markdown = {
      type: whisper.WhisperComponentType.Markdown,
      body: stripIndent`
      # BMI calculator
      Input the height and weight of the patient below
      to receive the correct BMI.
      `,
    };

    const BMI: whisper.Message = {
      type: whisper.WhisperComponentType.Message,
      header: 'The BMI is:',
      body: this.props.bmi
        ? `${this.props.bmi}: ${this.props.category}`
        : 'Type in the field below to update this line of text',
      style: whisper.Urgency.Success,
    };

    const select: whisper.Select = {
      type: whisper.WhisperComponentType.Select,
      label: 'Select Units',
      options: ['Metric (cm/kg)', 'English (lb/in)'],
      onSelect: (_error: Error | undefined, val: number) => {
        console.log('Selected: ', val);
        let unit: string = val === 0 ? 'Metric' : 'English';
        this.update({ unit });
      },
    };

    const Height: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: `Height in ${this.props.unit}`,
      onChange: (_error: Error | undefined, val: string) => {
        let bmi: any;
        let category: string;
        console.log('Updating height text: ', val);
        let num: number = parseFloat(val);
        this.update({ height: num });

        if (this.props.unit === 'English') {
          bmi = (this.props?.weight / (this.props?.height * this.props?.height)) * 703;
        } else {
          bmi = (this.props?.weight / this.props?.height / this.props?.height) * 10000;
        }
        bmi = bmi.toFixed(1);
        if (bmi < 18.5) category = 'Underweight';
        if (bmi > 18.5 && bmi < 24.9) category = 'Normal Weight';
        if (bmi > 25 && bmi < 29.9) category = 'Overweight';
        if (bmi > 30) category = 'Obesity';
        this.update({ bmi, category });
      },
    };

    const Weight: whisper.TextInput = {
      type: whisper.WhisperComponentType.TextInput,
      label: `Weight in ${this.props.unit}`,
      onChange: (_error: Error | undefined, val: string) => {
        let bmi: any;
        let category: string;
        console.log('Updating weight text: ', val);
        let num: number = parseFloat(val);
        this.update({ weight: num });
        if (this.props.unit === 'English') {
          bmi = (this.props?.weight / (this.props?.height * this.props?.height)) * 703;
        } else {
          bmi = (this.props?.weight / this.props?.height / this.props?.height) * 10000;
        }
        bmi = bmi.toFixed(1);
        if (bmi < 18.5) category = 'Underweight';
        if (bmi > 18.5 && bmi < 24.9) category = 'Normal Weight';
        if (bmi > 25 && bmi < 29.9) category = 'Overweight';
        if (bmi > 30) category = 'Obesity';
        this.update({ bmi, category });
      },
    };

    return [instructions, BMI, select, Height, Weight];
  }

  show() {
    whisper
      .create({
        components: this.createComponents(),
        label: this.label,
        onClose: BmiWhisper.onClose,
      })
      .then((newWhisper) => {
        this.whisper = newWhisper;
      });
  }

  update(props: Partial<Props>) {
    console.log('UPDATING@', JSON.stringify(props));
    this.props = { ...this.props, ...props };
    this.whisper.update({
      label: this.label,
      components: this.createComponents(),
    });
    console.log('NEWWW STUFF', JSON.stringify(this.props));
  }

  close() {
    this.whisper.close(BmiWhisper.onClose);
  }

  static onClose(err?: Error) {
    if (err) {
      console.error('There was an error closing Intro whisper', err);
    }
    console.log('Intro whisper closed');
  }
}
