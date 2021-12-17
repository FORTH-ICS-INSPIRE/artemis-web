import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { formatDate } from '../../utils/token';

class ModuleState extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      visibility: false,
    };
  }
  render() {
    const { process, index, tooltip, modules } = this.props;
    if (!process || !modules) return <> </>;

    const modName = process.name.substring(0, process.name.indexOf('-'));
    const totalModules = modules[modName].length;
    const activeModules = modules[modName].filter(
      (module) => module[1] === true
    ).length;

    return (
      <>
        <tr key={index}>
          <td>
            <div
              style={{ width: '150px' }}
              data-tip
              data-for={'module' + index}
            >
              {process && modName.charAt(0).toUpperCase() + modName.slice(1)}
            </div>
            <ReactTooltip html={true} id={'module' + index}>
              {tooltip ?? 'Loading...'}
            </ReactTooltip>
          </td>
          <td>
            {process ? (
              process.running && activeModules > 0 ? (
                <button type="button" className="btn btn-success btn-sm">
                  On{' '}
                  <span className="badge badge-light">
                    {activeModules}/{totalModules}
                  </span>
                </button>
              ) : (
                <button type="button" className="btn btn-danger btn-sm">
                  Off{' '}
                  <span className="badge badge-light">
                    {activeModules}/{totalModules}
                  </span>
                </button>
              )
            ) : (
              ''
            )}
          </td>
          <td>
            <a
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                this.setState({ visibility: !this.state.visibility });
              }}
              onClick={(e) => {
                this.setState({ visibility: !this.state.visibility });
              }}
              id={modName}
              className="view_multiple_modules"
            >
              View instances
            </a>
          </td>
        </tr>
        {modules[modName].map(
          (module, i) =>
            this.state.visibility && (
              <tr
                key={index + '_' + i + '0'}
                id={modName + '_mods'}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <td key={index + '_' + i + '1'}>
                  {module[0].charAt(0).toUpperCase() + module[0].slice(1)}
                </td>
                <td key={index + '_' + i + '2'}>
                  {module[1] ? (
                    <button type="button" className="btn btn-success btn-sm">
                      On
                    </button>
                  ) : (
                    <button type="button" className="btn btn-danger btn-sm">
                      Off
                    </button>
                  )}
                </td>
                <td key={index + '_' + i + '3'}>
                  {module[1] &&
                    formatDate(
                      new Date(module[2]),
                      Math.abs(new Date().getTimezoneOffset() / 60)
                    )}
                </td>
              </tr>
            )
        )}
      </>
    );
  }
}

export default ModuleState;
