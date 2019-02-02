Vue.component('form-attribute', {
    template: `
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">

                <!-- Header -->
                <div class="modal-header bg-light text-dark">
                    <h5 class="modal-title" id="attributeModalTitle">
                        Edit Attribute
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </div>

                <!-- Attribute Form -->
                <div class="modal-body bg-dark text-light">
                    <form>
                        <div class="form-group">
                            <label for="attributeName" class="col-form-label">
                                Name:
                            </label>
                            <input
                                id="attributeName"
                                type="text"
                                required="true"
                                class="form-control col-sm"
                                placeholder="Attribute name"
                                v-model="attribute.name" />
                        </div>

                        <div class="form-group">
                            <label for="attributeDescription" class="col-form-label">
                                Description:
                            </label>
                            <textarea
                                id="attributeDescription"
                                class="form-control col-sm"
                                placeholder="Attribute description"
                                rows="3"
                                v-model="attribute.description" />
                        </div>

                        <div class="form-group">
                            <label for="attributeLinkedList" class="col-form-label">
                                Linked List:
                            </label>
                            <select
                                id="attributeLinkedList"
                                class="form-control col-sm"
                                v-model="attribute.linkedListId">
                                    <option selected></option>
                                    <option v-for="linkedList in linkedLists" v-bind:value="linkedList.id">
                                        {{ linkedList.name }}
                                    </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="attributeDataType" class="col-form-label">
                                Data Type:
                            </label>
                            <select
                                id="attributeDataType"
                                required="true"
                                class="form-control col-sm"
                                v-model="attribute.dataTypeId">
                                    <option v-for="dataType in dataTypes" v-bind:value="dataType.id">
                                        {{ dataType.name }}
                                    </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="attributeMandatory" class="col-form-label">
                                Mandatory:
                            </label>
                            <div class="form-check form-check-inline">
                                <input
                                    id="attributeMandatory"
                                    class="form-check-input"
                                    type="checkbox" value=""
                                    v-model="attribute.flagMandatory" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="attributeUnique" class="col-form-label">
                                Unique:
                            </label>
                            <div class="form-check form-check-inline">
                                <input
                                    id="attributeUnique"
                                    class="form-check-input"
                                    type="checkbox"
                                    value=""
                                    v-model="attribute.flagUnique" />
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="attributeDefaultValue" class="col-form-label">
                                Default Value:
                            </label>
                            <input
                                id="attributeDefaultValue"
                                class="form-control col-sm"
                                type="text"
                                placeholder="Attribute default value"
                                v-model="attribute.defaultValue" />
                        </div>
                    </form>
                </div>

                <!-- Button Menu -->
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-success" v-on:click="saveAttribute(attribute.id)">
                        Save
                    </button>

                    <button type="button" class="btn btn-danger" v-on:click="deleteAttribute(attribute.id)">
                        Delete
                    </button>

                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `,
    props: {
        'listId': Number,
        'attribute': Object,
        'linkedLists': Array,
        'dataTypes': Array
    },
    data: function () {
        return {
            'queryGetAttribute': `query getAttribute($id: Int!) {
                sysAttributeById(id: $id) {
                    id
                    name
                    description
                    flagMandatory
                    flagUnique
                    sysListByLinkedListId {
                        id
                        name
                    }
                    sysDataTypeByDataTypeId {
                        id
                        name
                    }
                    defaultValue
                }
            }`,
            'mutationCreateAttribute': `mutation createAttribute($sysAttribute: SysAttributeInput!) {
                createSysAttribute(input: {sysAttribute: $sysAttribute}) {
                    sysAttribute {
                        id
                        name
                        description
                        flagMandatory
                        flagUnique
                        linkedListId
                        sysDataTypeByDataTypeId {
                            id
                            name
                        }
                        defaultValue
                    }
                }
            }`,
            'mutationUpdateAttribute': `mutation updateAttribute($id: Int!, $sysAttributePatch: SysAttributePatch!) {
                updateSysAttributeById(input: {id: $id, sysAttributePatch: $sysAttributePatch }) {
                    sysAttribute {
                        id
                        name
                        description
                        flagMandatory
                        flagUnique
                        linkedListId
                        sysDataTypeByDataTypeId {
                            id
                            name
                        }
                        defaultValue
                    }
                }
            }`,
            'mutationDeleteAttribute': `mutation deleteAttribute($id: Int!) {
                deleteSysAttributeById(input: {id: $id}){
                    sysAttribute {
                        id
                    }
                }
            }`
        }
    },
    methods: {
        saveAttribute(attributeId) {
            // Method to create or update an attribute
            // Verify if attributeId is provided
            if (isNaN(attributeId)) {
                // Create a new attribute
                payload = {
                    'query': this.mutationCreateAttribute,
                    'variables': {
                        'sysAttribute': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedListId': this.attribute.linkedListId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.status == "200"){
                            if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                            } else {
                                this.hideModal('attributeModal');
                                window.location.href = 'edit-list.html?listId=' + this.listId;
                            }
                        }
                    }
                );
            }
            else {
                // Update an existing attribute
                payload = {
                    'query': this.mutationUpdateAttribute,
                    'variables': { 
                        'id': attributeId,
                        'sysAttributePatch': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedListId': this.attribute.linkedListId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.status == "200"){
                            if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                            } else {
                                this.hideModal(this.attribute.id);
                                window.location.href = 'edit-list.html?listId=' + this.listId;
                            }
                        }
                    }
                );
            }
        },
        deleteAttribute(attributeId) {
            // Method to delete an attribute
            payload = {
                'query': this.mutationDeleteAttribute,
                'variables': {
                    'id': attributeId
                }
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                              
                        } else {
                            this.hideModal(this.attribute.id);
                            window.location.href = 'edit-list.html?listId=' + this.listId;
                        }
                    }
                }
            );
        },
        hideModal(modalId) {
            $('#' + modalId).modal('hide');
        }
    }
});