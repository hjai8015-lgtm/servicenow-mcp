import "dotenv/config";
import axios from "axios";
const instance = process.env.SN_INSTANCE;
const auth = {
    username: process.env.SN_USER,
    password: process.env.SN_PASS,
};
export async function getMyIncidents() {
    const res = await axios.get(`${instance}/api/now/table/incident?sysparm_limit=5`, { auth });
    return res.data.result.map((i) => ({
        number: i.number,
        short_description: i.short_description,
        state: i.state,
    }));
}
export async function createIncident(short_description) {
    const res = await axios.post(`${instance}/api/now/table/incident`, { short_description }, { auth });
    return {
        number: res.data.result.number,
        sys_id: res.data.result.sys_id,
    };
}
