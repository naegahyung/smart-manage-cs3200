import axios from 'axios'

export async function getAllPortfoliosForUser() {
    const { status, data } = await axios.get('/api/properties')
    if (status !== 200) {
        console.log("error")
        return null
    }
    const json = JSON.parse(_cleanse_single_quotes(data))
    console.log(json[0])
    return json
}

function _cleanse_single_quotes(str) {
    return str.replace(/'/g, '"')
}
