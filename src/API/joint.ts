

import axois from '../utils/axiosExport'

/**
 *   TODO:-
 */



export function getDivvyDrawList(pageSize:any,pageNum:any=10) {
    return axois.request({
        url: `/jJointHoldDivvyUser/divvyDrawList?pageSize=${pageSize}?pageNum=${pageNum}`,
        method: 'get'
    })
}



export function getDivvyIncomeList(pageSize:any,pageNum:any=10) {
    return axois.request({
        url: `/jJointHoldDivvyUser/divvyIncomeList?pageSize=${pageSize}?pageNum=${pageNum}`,
        method: 'get'
    })
}



export function getDivvyInfo() {
    return axois.request({
        url: "/jJointHoldDivvyUser/divvyInfo",
        method: 'get'
    })
}



export function handleDrawDivvyIncome() {
    return axois.request({
        url: "/jJointHoldDivvyUser/drawDivvyIncome",
        method: 'get'
    })
}



/**
 *   TODO:-
 */


// -
export function getDivvyRankingList() {
    return axois.request({
        url: "/jJointHoldDivvyUser/divvyRankingList",
        method: 'get'
    })
}


/**
 *   TODO:-
 */


// -
export function handleDrawDynamicGratefulIncome() {
    return axois.request({
        url: "/jJointHoldDynamicUser/drawDynamicGratefulIncome",
        method: 'get'
    })
}


// -
export function handleDrawDynamicManageIncome() {
    return axois.request({
        url: "/jJointHoldDynamicUser/drawDynamicManageIncome",
        method: 'get'
    })
}



// -
export function getGratefulAwardList(pageSize:any,pageNum:any=10) {
    return axois.request({
        url: `/jJointHoldDynamicUser/gratefulAwardList?pageSize=${pageSize}?pageNum=${pageNum}`,
        method: 'get'
    })
}

// -
export function getIncomeInfo() {
    return axois.request({
        url: "/jJointHoldDynamicUser/incomeInfo",
        method: 'get'
    })
}

// -
export function getManageAwardList(pageSize:any,pageNum:any=10) {
    return axois.request({
        url: `/jJointHoldDynamicUser/manageAwardList?pageSize=${pageSize}?pageNum=${pageNum}`,
        method: 'get'
    })
}

/**
 * TODO:-
 */

// -
export function handleDrawStaticIncome() {
    return axois.request({
        url: "/jJointHoldStaticUser/drawStaticIncome",
        method: 'get'
    })
}
// -
export function handleDrawStaticIncomeHoldUbkx() {
    return axois.request({
        url: "/jJointHoldUbkxUser/drawStaticIncome",
        method: 'get'
    })
}


// -
export function getExitList() {
    return axois.request({
        url: "/jJointHoldStaticUser/exitList",
        method: 'get'
    })
}


// -
export function handleExitPledge(data: any) {
    return axois.request({
        url: "/jJointHoldStaticUser/exitPledge",
        method: 'post',
        data
    })
}
// -
export function getExitPledgeAccount(data: any) {
    return axois.request({
        url: "/jJointHoldStaticUser/getExitPledgeAccount",
        method: 'post',
        data
    })
}


// -
// export function getExitPledgeAccount() {
//     return axois.request({
//         url: "/jJointHoldStaticUser/getExitPledgeAccount",
//         method: 'get'
//     })
// }


// -
export function getJoinInfo() {
    return axois.request({
        url: "/jJointHoldStaticUser/joinInfo",
        method: 'get'
    })
}
// -BKX-
export function getJoinInfoUbkxUser() {
    return axois.request({
        url: "/jJointHoldUbkxUser/joinInfo",
        method: 'get'
    })
}
// -BKX-
export function getjoinListUbkxUser() {
    return axois.request({
        url: "/jJointHoldUbkxUser/joinList",
        method: 'get'
    })
}
// -BKX-
export function staticIncomeList(pageNum:any,pageSize:any=10) {
    return axois.request({
        url: `/jJointHoldUbkxUser/staticIncomeList?pageNum=${pageNum}?pageSize=${pageSize}`,
        method: 'get'
    })
}


// -
export function getJoinList() {
    return axois.request({
        url: "/jJointHoldStaticUser/joinList",
        method: 'get'
    })
}
// -BKX-
export function getJoinListUbkxUser() {
    return axois.request({
        url: "/jJointHoldUbkxUser/joinList",
        method: 'get'
    })
}


// -
export function getStaticIncomeList(pageNum:any,pageSize:any=10) {
    return axois.request({
        url: `/jJointHoldStaticUser/staticIncomeList?pageNum=${pageNum}?pageSize=${pageSize}`,
        method: 'get'
    })
}






