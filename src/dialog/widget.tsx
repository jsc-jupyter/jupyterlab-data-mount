import * as React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { IDropdownValues, DropdownComponent } from '../components/dropdown';
import { TextField } from '../components/textfield';
import Checkbox from '../components/checkbox';

import { IDataMount, IUFTPConfig } from '../index';
import B2Drop from '../templates/b2drop';
import AWS from '../templates/aws';
import S3 from '../templates/s3';
import Webdav from '../templates/webdav';
import Generic from '../templates/generic';
import UFTP from '../templates/uftp';
export class MountDialogBody extends ReactWidget {
  private mountcomponent_ref: any;
  private editable: boolean;
  private options: any;
  private templates: string[];
  private mountDir: string;
  private uftp_config: IUFTPConfig;

  getValue(): IDataMount {
    try {
      const displayName =
        this.mountcomponent_ref.current.template_ref.current.getDisplayName();
      return {
        template: this.mountcomponent_ref.current.state.datamount.template,
        path: this.mountcomponent_ref.current.state.datamount.path,
        options: {
          ...this.mountcomponent_ref.current.state.datamount.options,
          displayName
        },
        loading: false,
        failedLoading: false
      };
    } catch (e) {
      return {
        template: 'none',
        path: `${this.mountDir}/none`,
        options: {},
        loading: false,
        failedLoading: false
      };
    }
  }

  constructor(
    editable: boolean | false,
    options: any,
    templates: string[],
    mountDir: string,
    uftp_config: IUFTPConfig
  ) {
    super();
    this.editable = editable;
    this.options = options;
    this.templates = templates;
    this.mountDir = mountDir;
    this.mountcomponent_ref = React.createRef();
    this.uftp_config = uftp_config;
  }
  render() {
    return (
      <MountDialogComponent
        ref={this.mountcomponent_ref}
        editable={this.editable}
        options={this.options}
        templates={this.templates}
        mountDir={this.mountDir}
        uftp_config={this.uftp_config}
      />
    );
  }
}

interface IMountDialogComponentState {
  datamount: IDataMount;
}

export class MountDialogComponent extends React.Component<
  {
    editable: boolean;
    options: any;
    templates: string[];
    mountDir: string;
    uftp_config: IUFTPConfig;
  },
  IMountDialogComponentState
> {
  private template_ref: any;
  private templates: IDropdownValues[];
  private templates_all: IDropdownValues[] = [
    { value: 'aws', label: 'AWS' },
    { value: 'b2drop', label: 'B2Drop' },
    {
      value: 's3',
      label: 'S3 Compliant Storage Provider'
    },
    {
      value: 'webdav',
      label: 'WebDAV'
    },
    {
      value: 'generic',
      label: 'Generic'
    },
    {
      value: 'uftp',
      label: 'UFTP'
    }
  ];

  private tooltips: any;

  handleTemplateChange(key: string, value: string) {
    this.setState(prevState => {
      return {
        datamount: {
          ...prevState.datamount,
          template: value,
          path: `${this.props.mountDir}/${value}`
        }
      };
    });
  }

  handlePathChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    this.setState(prevState => ({
      datamount: {
        ...prevState.datamount,
        template: prevState.datamount.template,
        path: value
      }
    }));
  }

  handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    this.setState(prevState => ({
      datamount: {
        ...prevState.datamount,
        template: prevState.datamount.template,
        options: {
          ...prevState.datamount.options,
          readonly: checked
        }
      }
    }));
  }

  handleGenericOptionChange() {
    if (this.template_ref.current) {
      const readonly = this.state.datamount.options.readonly;
      const rowDict = this.template_ref.current.state.rows.reduce(
        (acc: Record<string, string>, row: any) => {
          acc[row.valueFirst] = row.valueSecond;
          return acc;
        },
        {}
      );
      this.setState(prevState => ({
        datamount: {
          ...prevState.datamount,
          template: prevState.datamount.template,
          config: {
            ...rowDict,
            readonly
          }
        }
      }));
    }
  }

  handleOptionChange = (key: string, value: string | null) => {
    this.setState(prevState => {
      const newDatamount = {
        ...prevState.datamount,
        template: prevState.datamount.template,
        config: { ...prevState.datamount.options } // Ensure config is updated immutably
      };

      if (value === null) {
        delete newDatamount.options[key];
      } else {
        newDatamount.options[key] = value;
      }

      return {
        datamount: newDatamount
      };
    });
  };

  constructor(props: {
    editable: boolean;
    options: any;
    templates: string[];
    mountDir: string;
    uftp_config: IUFTPConfig;
  }) {
    super(props);
    this.template_ref = React.createRef();
    this.tooltips = {
      path: `Prefix ${this.props.mountDir} will be added automatically.`
    };
    this.state = {
      datamount: {
        template: props.options?.template || props.templates[0],
        path: props.options?.path || `${props.mountDir}/${props.templates[0]}`,
        options: {
          ...props.options?.options,
          readonly: props.options?.options?.readonly ?? false
        },
        loading: props.options?.loading ?? false,
        failedLoading: props.options?.failedLoading ?? false
      }
    };

    if (props.templates) {
      const templateOrder = new Map(
        props.templates.map((t, index) => [t, index])
      );

      this.templates = this.templates_all
        .filter(template => templateOrder.has(template.value))
        .sort(
          (a, b) => templateOrder.get(a.value)! - templateOrder.get(b.value)!
        );
    } else {
      this.templates = [...this.templates_all]; // Default to all templates if none are provided
    }

    if (props.uftp_config?.name) {
      this.templates = this.templates.map(t =>
        t.value === 'uftp' ? { ...t, label: props.uftp_config.name } : t
      );
    }

    this.handleTemplateChange = this.handleTemplateChange.bind(this);
    this.handlePathChange = this.handlePathChange.bind(this);
    this.handleGenericOptionChange = this.handleGenericOptionChange.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  render(): JSX.Element {
    const { template } = this.state.datamount;
    return (
      <>
        <DropdownComponent
          label="Template"
          key_="template"
          selected={this.state.datamount.template}
          values={this.templates}
          onValueChange={this.handleTemplateChange}
          editable={this.props.editable}
          searchable={true}
        />
        <TextField
          label="Mount Path"
          name="path"
          tooltip={this.tooltips.path}
          value={this.state.datamount.path}
          editable={this.props.editable}
          onChange={this.handlePathChange}
        />
        <Checkbox
          label="Read only"
          name="readonly"
          checked={this.state.datamount.options.readonly}
          editable={this.props.editable}
          onChange={this.handleCheckboxChange}
        />
        {template === 'b2drop' && (
          <B2Drop
            onValueChange={this.handleOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
          />
        )}
        {template === 'generic' && (
          <Generic
            onValueChange={this.handleGenericOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
          />
        )}
        {template === 'aws' && (
          <AWS
            onValueChange={this.handleOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
          />
        )}
        {template === 's3' && (
          <S3
            onValueChange={this.handleOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
          />
        )}
        {template === 'webdav' && (
          <Webdav
            onValueChange={this.handleOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
          />
        )}
        {template === 'uftp' && (
          <UFTP
            onValueChange={this.handleOptionChange}
            ref={this.template_ref}
            editable={this.props.editable}
            options={this.state.datamount.options}
            config={this.props.uftp_config}
          />
        )}
      </>
    );
  }
}
