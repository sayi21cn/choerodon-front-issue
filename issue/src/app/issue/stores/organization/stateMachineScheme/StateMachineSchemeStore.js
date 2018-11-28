import { observable, action, computed } from 'mobx';
import { axios, store } from 'choerodon-front-boot';
import querystring from 'query-string';

@store('StateMachineSchemeStore')
class StateMachineSchemeStore {
  @observable isLoading = false;

  @observable stateMachineLoading = false;

  @observable stateMachineSchemeList = [];

  @observable pagination = {
    current: 1,
    pageSize: 10,
  };

  @observable isAddVisible = false;

  @observable graphLoading = false;

  @observable isConnectVisible = false;

  @observable isMachineDeleteVisible = false;

  @observable isSchemeDeleteVisible = false;

  @observable isPublishVisible = false;

  @observable stateMachine = {};

  @observable allStateMachine = [];

  @observable allIssueType = [];

  @observable newStateMachineId = '';

  @observable schemeDTOs = [];

  @observable selectedIssueTypeId = [];

  @observable nodeData = [];

  @observable transferData = [];

  @observable publishData = [];

  @observable publishLoading = false;


  @action setGraphLoading(data) {
    this.graphLoading = data;
  }

  @computed
  get getGraphLoading() {
    return this.graphLoading;
  }

  @computed
  get getIsLoading() {
    return this.isLoading;
  }

  @action
  setIsLoading(loading) {
    this.isLoading = loading;
  }

  @computed
  get getStateMachineLoading() {
    return this.stateMachineLoading;
  }

  @action
  setStateMachineLoading(loading) {
    this.stateMachineLoading = loading;
  }

  @computed
  get getStateMachineSchemeList() {
    return this.stateMachineSchemeList.slice();
  }

  @action
  setStateMachineSchemeList(data) {
    this.stateMachineSchemeList = data;
  }

  @computed
  get getStateMachine() {
    return this.stateMachine;
  }

  @action
  setStateMachine(data) {
    this.stateMachine = data;
  }

  @computed
  get getIsAddVisible() {
    return this.isAddVisible;
  }

  @action
  setIsAddVisible(visibleStatus) {
    this.isAddVisible = visibleStatus;
  }

  @computed
  get getIsConnectVisible() {
    return this.isConnectVisible;
  }

  @action
  setIsConnectVisible(visibleStatus) {
    this.isConnectVisible = visibleStatus;
  }

  @computed
  get getIsPublishVisible() {
    return this.isPublishVisible;
  }

  @action
  setIsPublishVisible(data) {
    this.isPublishVisible = data;
  }

  @computed
  get getIsMachineDeleteVisible() {
    return this.isMachineDeleteVisible;
  }

  @action
  setIsMachineDeleteVisible(visibleStatus) {
    this.isMachineDeleteVisible = visibleStatus;
  }

  @computed
  get getIsSchemeDeleteVisible() {
    return this.isSchemeDeleteVisible;
  }

  @action
  setIsSchemeDeleteVisible(visibleStatus) {
    this.isSchemeDeleteVisible = visibleStatus;
  }

  @computed
  get getAllStateMachine() {
    return this.allStateMachine;
  }

  @action
  setAllStateMachine(data) {
    this.allStateMachine = data;
  }

  @computed
  get getAllIssueType() {
    return this.allIssueType;
  }

  @action
  setAllIssueType(data) {
    this.allIssueType = data;
  }

  @computed
  get getSchemeDTOs() {
    return this.schemeDTOs;
  }

  @action
  setSchemeDTOs(data) {
    this.schemeDTOs = data;
  }

  @computed
  get getNewStateMachineId() {
    return this.newStateMachineId;
  }

  @action
  setNewStateMachineId(data) {
    this.newStateMachineId = data;
  }

  @computed
  get getSelectedIssueTypeId() {
    return this.selectedIssueTypeId;
  }

  @action
  setSelectedIssueTypeId(data) {
    this.selectedIssueTypeId = data;
  }

  @computed
  get getNodeData() {
    return this.nodeData;
  }

  @action
  setNodeData(data) {
    this.nodeData = data;
  }

  @computed
  get getTransferData() {
    return this.transferData;
  }

  @action
  setTransferData(data) {
    this.transferData = data;
  }

  @computed
  get getPublishData() {
    return this.publishData;
  }

  @action
  setPublishData(data) {
    this.publishData = data;
  }

  @action setPublishLoading(data) {
    this.publishLoading = data;
  }

  @computed
  get getPublishLoading() {
    return this.publishLoading;
  }

  loadStateMachineSchemeList = (orgId, pagination = this.pagination, sort = { field: 'id', order: 'desc' }, map = {}) => {
    this.setIsLoading(true);
    const { current, pageSize } = pagination;
    return axios.get(`/issue/v1/organizations/${orgId}/state_machine_scheme?page=${current - 1}&size=${pageSize}&${querystring.stringify(map)}&sort=${sort.field},${sort.order}`)
      .then(
        action((data) => {
          this.setIsLoading(false);
          if (data && data.failed) {
            return Promise.reject(data.message);
          } else {
            this.setStateMachineSchemeList(data.content);
            this.pagination = {
              ...pagination,
              total: data.totalElements,
            };
            return Promise.resolve(data);
          }
        }),
      )
      .catch((err) => {
        this.setIsLoading(false);
        return Promise.reject(err);
      });
  };

  createStateMachineScheme = (stateMachineScheme, organizationId) => {
    axios
      .post(
        `/issue/v1/organizations/${organizationId}/state_machine_scheme`,
        JSON.stringify(stateMachineScheme),
      )
      .then(
        action(() => {
          this.loadStateMachineSchemeList(organizationId);
        }),
      )
      .catch(() => {
        Choerodon.prompt('保存失败');
      });
  };

  editStateMachineScheme = (orgId, schemeId, data) => axios
    .put(`/issue/v1/organizations/${orgId}/state_machine_scheme/${schemeId}`, JSON.stringify(data));

  loadStateMachine = (orgId, schemeId, isDraft = true) => {
    this.setStateMachineLoading(true);
    return axios
      .get(`/issue/v1/organizations/${orgId}/state_machine_scheme/query_scheme_with_config/${schemeId}?isDraft=${isDraft}`)
      .then(
        action((data) => {
          if (data && data.failed) {
            return Promise.reject(data.message);
          } else {
            this.setStateMachineLoading(false);
            this.setStateMachine(data || {});
            return Promise.resolve(data);
          }
        }),
      );
  };

  loadGraphData = (orgId, stateMachineId) => {
    this.setGraphLoading(true);
    axios
      .get(`/state/v1/organizations/${orgId}/state_machines/${stateMachineId}`)
      .then((res) => {
        this.setGraphLoading(false);
        this.setNodeData(res.nodeDTOs);
        this.setTransferData(res.transfDTOs);
      })
      .catch((e) => {
        this.setGraphLoading(false);
      });
  };

  loadAllStateMachine = orgId => axios
    .get(`/state/v1/organizations/${orgId}/state_machines/query_all`)
    .then(
      action((res) => {
        this.setAllStateMachine(res);
      }),
    );

  loadAllIssueType(orgId, schemeId) {
    return axios
      .get(`/issue/v1/organizations/${orgId}/issue_type/query_issue_type_with_state_machine?schemeId=${schemeId}`)
      .then(
        action((res) => {
          this.setAllIssueType(res);
        }),
      );
  }

  saveStateMachine(orgId, schemeId, stateMachineId, schemeDTOs) {
    return axios
      .post(
        `/issue/v1/organizations/${orgId}/state_machine_scheme/create_config/${schemeId}/${stateMachineId}`,
        schemeDTOs,
      )
      .then(
        action(() => {
          this.loadStateMachine(orgId, schemeId);
        }),
      );
  }

  deleteStateMachine(orgId, schemeId, stateMachineId) {
    return axios
      .delete(`/issue/v1/organizations/${orgId}/state_machine_scheme/delete_config/${schemeId}/${stateMachineId}`)
      .then(
        action(() => {
          this.loadStateMachine(orgId, schemeId);
        }),
      );
  }

  deleteStateMachineScheme = (orgId, schemeId) => axios.delete(`/issue/v1/organizations/${orgId}/state_machine_scheme/${schemeId}`)
    .then(data => this.handleProptError(data));

  // 发布方案
  publishStateMachine = (orgId, schemeId, data) => axios.post(`/issue/v1/organizations/${orgId}/state_machine_scheme/deploy/${schemeId}`, data);

  // 检查发布
  checkPublishStateMachine = (orgId, schemeId) => axios.get(`/issue/v1/organizations/${orgId}/state_machine_scheme/check_deploy/${schemeId}`).then((data) => {
    if (data) {
      this.setPublishData(data);
      this.setPublishLoading(false);
    } else {
      this.setPublishData([]);
      this.setPublishLoading(false);
    }
  }).catch(() => {
    this.setPublishData([]);
    this.setPublishLoading(false);
  });

  // 删除草稿
  deleteDraft = (orgId, schemeId) => axios.delete(`/issue/v1/organizations/${orgId}/state_machine_scheme/delete_draft/${schemeId}`);

  handleProptError = (error) => {
    if (error && error.failed) {
      // Choerodon.prompt(error.message);
      return false;
    } else {
      return error;
    }
  }
}

const stateMachineSchemeStore = new StateMachineSchemeStore();

export default stateMachineSchemeStore;
