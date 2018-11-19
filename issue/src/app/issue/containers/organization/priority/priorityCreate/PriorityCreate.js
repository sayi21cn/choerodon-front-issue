import { Content, Header, Page, stores } from 'choerodon-front-boot';
import { Button, Card, Form, Icon, Input, message, Modal, Spin, Table, Tooltip, Checkbox } from 'choerodon-ui';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { CompactPicker } from 'react-color';

import '../../../main.scss';
import './priorityCreate.scss';

const FormItem = Form.Item;
const { Sidebar } = Modal;
const { confirm } = Modal;
const { TextArea } = Input;

const { AppState } = stores;

@Form.create({})
@injectIntl
@observer
class PriorityCreate extends Component {
  state = {
    priorityColor: '#3F51B5',
    displayColorPicker: false,
  }

  handleCreatingOk = () => {
    const { form, PriorityStore } = this.props;

    form.validateFieldsAndScroll(async (err, data) => {
      if (!err) {
        const { name, des, isDefault } = data;
        const { priorityColor } = this.state;
        const orgId = AppState.currentMenuType.organizationId;

        try {
          await PriorityStore.createPriority(orgId, {
            name,
            des,
            isDefault,
            priorityColor,
          });
          message.success('添加成功');
          PriorityStore.loadPriorityList(orgId);
          this.hideSidebar();
        } catch (err) {
          message.error('添加失败');
        }
      }
    });
  }

  handleCreatingCancel = () => {
    this.hideSidebar();
  }

  handleChangeComplete = async (color) => {
    this.setState({
      priorityColor: color.hex,
    });
  };

  handleClickSwatch = () => {
    const { displayColorPicker } = this.state;
    this.setState({
      displayColorPicker: !displayColorPicker,
    });
  }

  handleCloseColorPicker = () => {
    const { displayColorPicker } = this.state;
    this.setState({
      displayColorPicker: false,
    });
  }

  checkName = async (rule, value, callback) => {
    // 名称检查
    const { form, PriorityStore, intl } = this.props;
    const { getFieldValue } = form;
    const inputName = getFieldValue('name');
    const orgId = AppState.currentMenuType.organizationId;
    const res = await PriorityStore.checkName(orgId, inputName);
    if (!res) {
      callback(intl.formatMessage({ id: 'priority.create.name.error' }));
    } else {
      callback();
    }
  }

  hideSidebar() {
    const { PriorityStore, form } = this.props;
    PriorityStore.setOnCreatingPriority(false);

    form.resetFields();
    this.setState({
      priorityColor: '#0062B1',
      displayColorPicker: false,
    });
  }

  render() {
    const { priorityColor, displayColorPicker } = this.state;
    const { PriorityStore, form, intl } = this.props;
    const { onCreatingPriority } = PriorityStore;
    const { getFieldDecorator } = form;

    return (
      <Sidebar
        title={<FormattedMessage id="priority.create" />}
        visible={onCreatingPriority}
        okText={<FormattedMessage id="save" />}
        cancelText={<FormattedMessage id="cancel" />}
        onOk={this.handleCreatingOk}
        onCancel={this.handleCreatingCancel}
      >
        <Form className="issue-form">
          <FormItem
            label="name"
          >
            {
              getFieldDecorator(
                'name',
                {
                  rules: [
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'required' }),
                    },
                    {
                      validator: this.checkName,
                    },
                  ],
                },
              )(
                <Input
                  label={<FormattedMessage id="priority.name" />}
                  placeholder={intl.formatMessage({ id: 'priority.create.name.placeholder' })}
                  maxLength={15}
                />,
              )
            }
          </FormItem>
          <FormItem
            label="des"
          >
            {
              getFieldDecorator(
                'des',
              )(
                <TextArea
                  label={<FormattedMessage id="priority.des" />}
                  placeholder={intl.formatMessage({ id: 'priority.create.des.placeholder' })}
                  maxLength={45}
                />,
              )
            }
          </FormItem>
          <div className="issue-color-picker">
            <div className="issue-priority-swatch" onClick={this.handleClickSwatch} role="none">
              <div className="issue-priority-color" style={{ background: priorityColor }} />
            </div>
            {
              displayColorPicker
                ? (
                  <div className="popover">
                    <div className="cover" onClick={this.handleCloseColorPicker} role="none" />
                    <CompactPicker color={priorityColor} onChange={this.handleChangeComplete} />
                  </div>
                )
                : null
            }
          </div>
          <FormItem
            label="isDefault"
          >
            {
              getFieldDecorator(
                'isDefault',
              )(
                <Checkbox>设置为默认优先级</Checkbox>,
              )
            }
          </FormItem>
        </Form>
      </Sidebar>
    );
  }
}

export default PriorityCreate;