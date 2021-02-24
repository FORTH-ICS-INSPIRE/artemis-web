import {
  formatDate,
  getSeen,
  getWithdrawn,
  isIgnored,
  isResolved,
  isSeen,
  isUnderMitigation,
} from '../../utils/token';
import DMP from 'diff_match_patch';
import React, { Component } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import fetch from 'cross-fetch';
import { extractHijackInfos } from '../../utils/parsers';
import {
  sendHijackData,
  submitComment,
} from 'apps/artemis-web/utils/fetch-data';
import { animated, useTransition } from 'react-spring';
import { Grid, Paper } from '@material-ui/core';
import Tooltip from '../tooltip/tooltip';
import { useState } from 'react';
import { ContentState, Editor, EditorState } from 'draft-js';
import HijackAS from '../hijack-as/hijack-as';

class HijackInfoComponent extends Component<any, any> {
  hijackDataState: any;
  tooltips: any;
  setTooltips: any;
  context: any;
  seenTransitions: any;
  withdrawnTransitions: any;
  classes: any;
  setOpenModalState: any;
  hijackKey: any;
  editorState: any;
  commentRef: any;
  setEditorState: any;

  constructor(props) {
    super(props);
    this.hijackDataState = props.hijackDataState;
    this.tooltips = props.tooltips;
    this.setTooltips = props.setTooltips;
    this.context = props.context;
    this.classes = props.classes;
    this.setOpenModalState = props.setOpenModalState;
    this.hijackKey = props.hijackKey;
    this.editorState = props.editorState;
    this.setEditorState = props.setEditorState;

    this.state = {
      seenState: false,
      withdrawState: false,
      selectActionState: 'hijack_action_resolve',
      editComment: false,
    };

    this.commentRef = React.createRef();
  }

  render() {
    const [hijackInfoLeft, hijackInfoRight] = extractHijackInfos(
      this.hijackDataState,
      {
        tooltips: this.tooltips,
        setTooltips: this.setTooltips,
        context: this.context,
      }
    );
    const commentRef = this.commentRef;
    const hijackKey = this.hijackKey;

    return (
      <>
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-lg-1" />
          <div className="col-lg-7">
            <div className="card">
              <div className="card-header">
                Hijack Information
                {isSeen(this.hijackDataState) ? (
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
                      <div className="col-lg-4">
                        <button
                          onClick={() =>
                            this.setState({ seenState: !this.state.seenState })
                          }
                          className="btn btn-info"
                          type="button"
                          data-toggle="collapse"
                          data-target="#seenHijackUpdate"
                          aria-expanded="false"
                          aria-controls="seenHijackUpdate"
                        >
                          BGP Announcement
                        </button>
                      </div>
                      <div className="col-lg-8">
                        <button
                          onClick={() =>
                            this.setState({
                              withdrawState: !this.state.withdrawState,
                            })
                          }
                          className="btn btn-info"
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
          <div className="col-lg-3">
            <div className="row" style={{ marginBottom: '15px' }}>
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">Hijack Actions</div>
                  <div className="card-body">
                    <select
                      onChange={(e) =>
                        this.setState({ selectActionState: e.target.value })
                      }
                      style={{
                        width: '200px',
                        display: 'inline-block',
                        marginRight: '15px',
                      }}
                      className="form-control form-control-sm-auto"
                      id="action_selection"
                    >
                      {!isResolved(this.hijackDataState) &&
                        !isIgnored(this.hijackDataState) && (
                          <>
                            <option value="hijack_action_resolve">
                              Mark as Resolved
                            </option>
                            <option value="hijack_action_mitigate">
                              Mitigate Hijack
                            </option>
                          </>
                        )}
                      {!isUnderMitigation(this.hijackDataState) ? (
                        <option value="hijack_action_mitigate">
                          Mitigate Hijack
                        </option>
                      ) : (
                        <option value="hijack_action_unmitigate">
                          Un-mitigate Hijack
                        </option>
                      )}
                      {!isSeen(this.hijackDataState) ? (
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
                    </select>
                    <button
                      onClick={(e) =>
                        this.state.selectActionState === 'hijack_action_ignore'
                          ? this.setOpenModalState(true)
                          : sendHijackData(e, {
                              hijackKey: hijackKey,
                              selectState: this.state.selectActionState,
                              prefix: this.hijackDataState.prefix,
                              hijack_as: this.hijackDataState.hijack_as,
                              type: this.hijackDataState.type,
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
                      className={`btn btn-${
                        !this.state.editComment ? 'primary' : 'secondary'
                      } btn-md`}
                      onClick={(e) => {
                        if (this.state.editComment)
                          submitComment(e, { commentRef, hijackKey });
                        this.setState({ editComment: !this.state.editComment });
                      }}
                    >
                      {!this.state.editComment ? 'Edit' : 'Save'}
                    </button>
                  </div>
                  <div className="card-body">
                    <Editor
                      ref={commentRef}
                      readOnly={!this.state.editComment}
                      editorState={this.editorState}
                      onChange={this.setEditorState}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-1" />
          <div className="col-lg-10">
            <div className="card">
              <div className="card-body">
                <HijackAS
                  classes={this.classes}
                  tooltips={this.tooltips}
                  setTooltips={this.setTooltips}
                  contect={this.context}
                  hijackDataState={this.hijackDataState}
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
