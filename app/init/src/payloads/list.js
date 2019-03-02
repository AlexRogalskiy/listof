export const queryGetAllLists = `query getAllLists{
    allSysLists(orderBy: NAME_ASC) {
        nodes {
            id
            name
            description
        }
    }
}`;

export const queryGetList = `query getList($id: Int!) {
    sysListById(id: $id) {
        id
        name
        description
        tableName
        sysAttributesByListId {
            nodes {
                id
                name
                description
                flagMandatory
                flagUnique
                dataTypeId
                sysDataTypeByDataTypeId { name }
                linkedAttributeId
                sysAttributeByLinkedAttributeId {
                    name
                    columnName
                    listId
                    sysListByListId {
                        name
                        tableName
                    }
                }
                columnName
            }
        }
        createdDate
        updatedDate
        sysUserByCreatedById { email }
        sysUserByUpdatedById { email }
    }
}`;

// Response labels must be formatted according to Treeselect requirements
export const queryGetLinkedLists = `query getAllLists {
    allSysLists(orderBy: NAME_ASC) {
        nodes {
            id:nodeId
            label:name
            attributes:sysAttributesByListId {
                children:nodes {
                    id
                    label:name
                }
            }
        }
    }
}`;

export const mutationCreateList = `mutation createList($sysList: SysListInput!) {
    createSysList(input: {sysList: $sysList}) {
        sysList {
            id
        }
    }
}`;

export const mutationUpdateList = `mutation updateList($id: Int!, $sysListPatch: SysListPatch!) {
    updateSysListById(input: {id: $id, sysListPatch: $sysListPatch }) {
        sysList {
            id
        }
    }
}`;

export const mutationDeleteList = `mutation deleteList($id: Int!) {
    deleteSysListById(input: {id: $id}){
        sysList {
            id
        }
    }
}`;

export const mutationSearchList = `mutation searchList($keyword: String) {
    searchList(input: {keyword: $keyword}) {
        sysLists {
            id
            name
            description
        }
    }
}`;