import { Editor } from 'draft-js';
import React, { Component } from 'react';
import { sendHijackData, submitComment } from '../../utils/fetch-data';
import { extractHijackInfos } from '../../utils/parsers';
import {
  exportHijack,
  isIgnored,
  isResolved,
  isSeen,
  isUnderMitigation,
} from '../../utils/token';
import HijackAS from '../hijack-as/hijack-as';

class HijackInfoComponent extends Component<any, any> {
  seenTransitions: any;
  withdrawnTransitions: any;
  classes: any;
  setOpenModalState: any;
  hijackKey: any;
  commentRef: any;
  isMobile: any;
  selectRef: any;
  hijackInfoRight: any;
  hijackInfoLeft: any;

  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.setOpenModalState = props.setOpenModalState;
    this.hijackKey = props.hijackKey;

    const [hijackInfoLeft, hijackInfoRight] = extractHijackInfos(
      this.props.hijackDataState,
      {
        tooltips: this.props.tooltips,
        setTooltips: this.props.setTooltips,
        context: this.props.context,
      }
    );

    this.hijackInfoLeft = hijackInfoLeft;
    this.hijackInfoRight = hijackInfoRight;

    this.state = {
      seenState: false,
      withdrawState: false,
      editComment: false,
      commentSuccess: true,
      gripState: false,
      event_id : ""
    };

    this.isMobile = props.isMobile;

    this.commentRef = React.createRef();
    this.selectRef = React.createRef();

  }

  async componentDidMount() {

    const asn = this.hijackInfoLeft["Hijacker AS:"][0].props.asn;
    const prefix = this.hijackInfoLeft["Prefix"][0];

    const resp = await fetch(`https://api.grip.caida.org/v1/json/events?event_type=all&asns=${asn}&pfxs=${prefix}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const json = await resp.json();
      if (json.recordsTotal > 0) {
        this.setState({ gripState: true, event_id: json.data[0]["id"] });
      }
  }

  render() {
    const [hijackInfoLeft, hijackInfoRight] = extractHijackInfos(
      this.props.hijackDataState,
      {
        tooltips: this.props.tooltips,
        setTooltips: this.props.setTooltips,
        context: this.props.context,
      }
    );
    const commentRef = this.commentRef;
    const hijackKey = this.hijackKey;

    const mRef = this.selectRef;
    const setState = this.setState;
    const event_id = this.state.event_id;

    return (
      <>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-lg-1" />

          <div className={this.isMobile ? 'col-lg-10' : 'col-lg-7'}>
            <div className="card">
              <div className="card-header">
                Hijack Information
                {isSeen(this.props.hijackDataState) ? (
                  <span
                    id="hijack_acknowledged_badge"
                    className="badge badge-acknowledged float-right badge-primary"
                  >
                    Acknowledged
                  </span>
                ) : (
                  <span
                    id="hijack_acknowledged_badge"
                    className="badge badge-acknowledged float-right badge-danger"
                  >
                    Not Acknowledged
                  </span>
                )}
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6">
                    {Object.keys(hijackInfoLeft).map((key) => {
                      return (
                        <div key={key} className="row">
                          <div
                            className="col-lg-4"
                            style={{ fontWeight: 'bold' }}
                          >
                            {hijackInfoLeft[key][1]}
                          </div>
                          <div className="col-lg-8">
                            {typeof hijackInfoLeft[key][0] !== 'object' ? (
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfoLeft[key][0] ?? ''}
                              />
                            ) : (
                              hijackInfoLeft[key][0] ?? ''
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="col-lg-6">
                    {Object.keys(hijackInfoRight).map((key) => {
                      return (
                        <div key={key} className="row">
                          <div
                            className="col-lg-4"
                            style={{ fontWeight: 'bold' }}
                          >
                            {hijackInfoRight[key][1] ?? ''}
                          </div>
                          <div className="col-lg-8">
                            {typeof hijackInfoRight[key][0] !== 'object' ? (
                              <input
                                id="info_type"
                                className="form-control"
                                type="text"
                                readOnly={true}
                                value={hijackInfoRight[key][0] ?? ''}
                              />
                            ) : (
                              hijackInfoRight[key][0] ?? ''
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div className="row" style={{ marginTop: '20px' }}>
                      <div className="col-lg-5">
                        <button
                          onClick={() =>
                            this.setState({ seenState: !this.state.seenState })
                          }
                          type="button"
                          className="btn btn-primary btn-md"
                          data-toggle="collapse"
                          data-target="#seenHijackUpdate"
                          aria-expanded="false"
                          aria-controls="seenHijackUpdate"
                        >
                          BGP Announcement
                        </button>
                      </div>
                      <div className="col-lg-5 offset-lg-1">
                        <button
                          onClick={() => {
                            this.setState({
                              withdrawState: !this.state.withdrawState,
                            });
                          }}
                          className="btn btn-primary btn-md"
                          type="button"
                          data-toggle="collapse"
                          data-target="#seenHijackWithdraw"
                          aria-expanded="false"
                          aria-controls="seenHijackWithdraw"
                        >
                          BGP Withdrawal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!this.isMobile && (
            <div className="col-lg-3">
              <div className="row" style={{ marginBottom: '15px' }}>
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">Hijack Actions</div>
                    <div className="card-body">
                      <select
                        ref={this.selectRef}
                        style={{
                          width: '200px',
                          display: 'inline-block',
                          marginRight: '15px',
                        }}
                        className="form-control form-control-sm-auto"
                        id="action_selection"
                      >
                        {!isResolved(this.props.hijackDataState) &&
                          !isIgnored(this.props.hijackDataState) && (
                            <>
                              <option value="hijack_action_resolve">
                                Mark as Resolved
                              </option>
                              <option value="hijack_action_ignore">
                                Mark as Ignored
                              </option>
                            </>
                          )}
                        {!isUnderMitigation(this.props.hijackDataState) ? (
                          <option value="hijack_action_mitigate">
                            Mitigate Hijack
                          </option>
                        ) : (
                          <option value="hijack_action_unmitigate">
                            Un-mitigate Hijack
                          </option>
                        )}
                        {!isSeen(this.props.hijackDataState) ? (
                          <option value="hijack_action_acknowledge">
                            Mark as Acknowledged
                          </option>
                        ) : (
                          <option value="hijack_action_acknowledge_not">
                            Mark as Not Acknowledged
                          </option>
                        )}
                        <option value="hijack_action_delete">
                          Delete Hijack
                        </option>
                        <option value="hijack_action_export">
                          Export Hijack
                        </option>
                      </select>
                      <button
                        onClick={(e) =>
                          mRef.current.value === 'hijack_action_ignore'
                            ? this.setOpenModalState(true)
                            : mRef.current.value === 'hijack_action_export'
                              ? exportHijack(hijackKey, this.props._csrf)
                              : sendHijackData(e, {
                                hijackKey: hijackKey,
                                selectState: mRef.current.value,
                                prefix: this.props.hijackDataState.prefix,
                                hijack_as: this.props.hijackDataState.hijack_as,
                                type: this.props.hijackDataState.type,
                                _csrf: this.props._csrf,
                              })
                        }
                        style={{ marginRight: '5px' }}
                        id="apply_selected"
                        type="button"
                        className="btn btn-primary btn-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header">
                      Comments{' '}
                      <button
                        style={{ marginRight: '5px', float: 'right' }}
                        id="edit_comment"
                        type="button"
                        className={`btn btn-${!this.state.editComment ? 'primary' : 'secondary'
                          } btn-md`}
                        onClick={(e) => {
                          if (this.state.editComment)
                            setState({
                              commentSuccess: submitComment(e, {
                                commentRef,
                                hijackKey,
                                _csrf: this.props._csrf,
                              }),
                            });
                          else commentRef.current.focus();

                          this.setState({
                            editComment: !this.state.editComment,
                          });
                        }}
                      >
                        {!this.state.editComment ? 'Edit' : 'Save'}
                      </button>
                    </div>
                    <div className="card-body">
                      <h1
                        style={{
                          display: this.state.commentSuccess ? 'none' : 'block',
                          color: 'red',
                        }}
                      >
                        {' '}
                        Config failed to update.{' '}
                      </h1>
                      <Editor
                        ref={commentRef}
                        readOnly={!this.state.editComment}
                        editorState={this.props.editorState}
                        onChange={this.props.setEditorState}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="card" style={{ marginTop: '12px', visibility: this.state.gripState ? "visible" : "hidden" }}>
                    <div className="card-header">
                      CAIDA GRIP{' '}
                    </div>
                    <div className="card-body">
                      <button
                        style={{ marginRight: '5px', marginTop: '5px', float: 'left' }}
                        id="edit_comment"
                        type="button"
                        className={`btn btn-primary
                          } btn-lg`}
                        onClick={() => window.open(`https://grip-dev.caida.org/events/${'all'}/${event_id}`, "_blank")}
                      >
                        GRIP event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <div className="card">
              <div className="card-body">
                <HijackAS
                  classes={this.classes}
                  tooltips={this.props.tooltips}
                  setTooltips={this.props.setTooltips}
                  context={this.props.context}
                  withdrawState={this.state.withdrawState}
                  seenState={this.state.seenState}
                  hijackDataState={this.props.hijackDataState}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default HijackInfoComponent;
