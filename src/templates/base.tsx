import * as React from 'react';

// Define a generic type for the Props and State
interface IBaseProps {
  onValueChange: (key: string, value: any) => void;
  ref: any;
  editable: boolean;
  options: any;
}

interface IBaseState {
  // Add shared state properties here, if any
}

export class BaseComponent<
  P extends IBaseProps,
  S extends IBaseState
> extends React.Component<P, S> {
  constructor(props: P) {
    super(props);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
  }

  componentWillUnmount() {
    Object.keys(this.state).forEach(key => {
      this.props.onValueChange(key, null);
    });
  }

  componentDidMount() {
    Object.entries(this.state).forEach(([key, value]) => {
      this.props.onValueChange(key, value);
    });
  }

  getDisplayName() {
    return 'Replace in subclass';
  }

  handleDropdownChange(key: string, value: string) {
    this.setState({ [key]: value } as Pick<S, keyof S>, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange(key, value);
      }
    });
  }

  handleTextFieldChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    this.setState({ [name]: value } as Pick<S, keyof S>, () => {
      if (this.props.onValueChange) {
        this.props.onValueChange(name, value);
      }
    });
  }

  render() {
    return (
      <div>
        <h2>Replace in specific mount type</h2>
      </div>
    );
  }
}
