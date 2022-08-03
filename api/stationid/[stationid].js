export const config = {
    runtime: 'experimental-edge',
};  

export default async function handler(request, response) {
    console.log(request)
    let data = {}
    const { stationid } = request.query;
    try {
        const res = await fetch(
            `https://api.tankstelle.aral.de/api/v2/stations/${stationid}/prices`,
        )
        data = await res.json()
    } catch (e) {
        console.error(e)
    }

    response.setHeader("Access-Control-Allow-Origin", process.env.VERCEL_URL)
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS")
    response.setHeader("Content-Type", "application/json")
    response.setHeader("Cache-Control", "s-maxage=290")
    return response.status(200).json(data["data"])
}