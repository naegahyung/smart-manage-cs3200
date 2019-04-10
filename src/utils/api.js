import axios from 'axios'

/**
 * All of these API assumes that information is received based on username
 */

export function getAllPortfolios() {
    return _call_api('/api/properties', 'get')
}

export function getAllTasks() {
    return _call_api('/api/tasks', 'get')
}

export function deleteTaskById(id) {
    return _call_api('/api/task', 'delete', { data: { id }})
}

export function addTask(body, propertyId) {
    const payload = {
        created_by: 'f9a88fd7-8341-4355-a460-bbc0e79cb104',
        body,
    }
    if (propertyId && propertyId.length > 0) payload.property_id = propertyId
    return _call_api('/api/task', 'post', payload)
}

export function fetchAddress(body) {
    return _call_api('/api/address/search', 'post', {
        query: body,
    });
}

export function getAllUpdates() {
    return _call_api('/api/news?limit=10', 'get')
}

export function getPropertyInfo(id) {
    return _call_api(`/api/property/${id}`, 'get')
}

export function getTasksForProperty(id) {
    return _call_api(`/api/tasks/${id}`, 'get')
}

export function updateTaskApi(id, body) {
    return _call_api('/api/task', 'patch', { id, body })
}

export function addProperty(body) {
    return _call_api('/api/property', 'post', body)
}

export function deleteProperty(id) {
    return _call_api('/api/property', 'delete', { propertyId: id })
}

async function _call_api(url, method, data) {
    let response;
    if (method === 'get') {
        response = await axios.get(url)
    } else {
        response = await axios({
            method,
            url,
            data
        })
    }
    if (response.status !== 200) {
        console.log("error api ", url, method)
        return null
    }
    if (!response.data) {
        console.log("data no data load returned")
        return 'success'
    }
    let json = response.data
    if (typeof response.data === 'string') {
        json = JSON.parse(_cleanse_single_quotes(response.data))
    }
    return json
}

function _cleanse_single_quotes(str) {
    return str.replace(/'/g, '"')
}
