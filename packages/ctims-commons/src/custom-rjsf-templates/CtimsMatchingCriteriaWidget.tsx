import {WidgetProps} from "@rjsf/utils";
import React from "react";
import {Panel} from "primereact/panel";
import {Ripple} from "primereact/ripple";
import { TabView, TabPanel } from 'primereact/tabview';
import {useSelector} from "react-redux";
import {stringify} from 'yaml'
import {isObjectEmpty} from "../components/helpers";
import {RootState} from "../store/store"
import styles from './CtimsMatchingCriteriaWidget.module.scss';

const headerTemplate = (options: any, props: { title: string, }) => {
  const {title} = props;
  const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
  let className = `ctimsPanelHeaderMatching justify-content-start`;

  const titleClassName = `${options.titleClassName} pl-1`;

  const titleStyle: React.CSSProperties = {
    textTransform: 'uppercase',
  }

  return (
    <div className={className}>
            <span className={titleClassName} style={titleStyle}>
                {title}
            </span>
      <div>
        {/*<i className="pi pi-trash" style={trashIconStyle}></i>*/}
        <button className={options.togglerClassName} onClick={options.onTogglerClick}>
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
      </div>
    </div>
  )
}

const CtimsMatchingCriteriaWidget = (props: WidgetProps) => {
  const {
    id,
    label,
    disabled,
    formContext,
    readonly,
    onChange,
    uiSchema,
  } = props;

  // Will trigger re-render when the ctmlModel changes and thus will display the preview
  // The dispatch is called from ui.tsx in onDialogHideCallback
  const ctmlModel: any = useSelector((state: RootState) => state.finalModelAndErrors.ctmlModel);

  const btnClick = uiSchema!['onClick'];

  const headerTemplateOptions = {
    title: 'Matching Criteria',
  }

  const circleStyle: React.CSSProperties = {
    lineHeight: '56px',
    color: "#2E72D2",
    marginLeft: '20px',
  }

  const caretStyle: React.CSSProperties = {
    marginLeft: '6px',
    color: "#2E72D2",
  }

  const tabViewStyle: React.CSSProperties = {
    border: '1px solid #E4E4E4',
    borderRadius: '4px',
  }

  const yamlString = stringify(formContext.match, null, 2);
  const jsonString = JSON.stringify(formContext.match, null, 2);

  return (
      <div className={styles.container}>
        <Panel headerTemplate={(props) => headerTemplate(props, headerTemplateOptions)} toggleable>
          <div style={tabViewStyle}>
            <TabView>
              <TabPanel header="YAML">
                <div className={styles.preview}>
                  {isObjectEmpty(formContext.match) ?
                    null: <pre className={styles['pre-tag']}>{yamlString}</pre>
                  }
                </div>
              </TabPanel>
              <TabPanel header="JSON">
                <div className={styles.preview}>
                  {isObjectEmpty(formContext.match) ?
                    null: <pre className={styles['pre-tag']}>{jsonString}</pre>
                  }
                </div>
              </TabPanel>
            </TabView>
          </div>
        </Panel>
        <div className={styles['edit-matching-criteria-container']} onClick={(e) => btnClick(e, formContext, id)}>
          <i className="pi pi-pencil" style={circleStyle}></i>
          <div className={styles['edit-matching-criteria-title']}>Edit matching criteria</div>
          <i className="bi bi-caret-down-fill" style={caretStyle}></i>
        </div>
      </div>
  )
}
export default CtimsMatchingCriteriaWidget;
