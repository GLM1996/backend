import fetch from 'node-fetch';

//carga el deal desde el enlace del evento
export const obtenerDeal = async (dealUri) => {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    const options = {
        method: 'GET', headers: {
            'Authorization': 'Basic ' + btoa(API_KEY + ':'),
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788'
        }
    }
    const response = await fetch(dealUri, options);
    const data = await response.json();
    return data
}
//optiene la persona a la que se refiere el deal
export const obtenerPersonDelDeal = async (personId) => {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    let url = `https://api.followupboss.com/v1/people/${personId}`;
    const options = {
        method: 'GET', headers: {
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788',
            'Authorization': 'Basic ' + btoa(API_KEY + ':') // Usamos 'Basic' y la clave API codificada en base64
        }
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data
}
//actualiza la persona con los datos del deal
export const actualizarStagePerson = async (apiKey, deal, person) => {
    const url = `https://api.followupboss.com/v1/people/${person.id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788',
            'Authorization': 'Basic ' + btoa(apiKey + ':') // Usamos 'Basic' y la clave API codificada en base64
        },
        body: JSON.stringify({
            stage: deal.stageName, // Nuevo stage
        })
    }
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            // await actualizarDeal(stageId, newStage)
            // await createNoteForPerson(newStage);
        } else {
            const errorData = await response.json();
            showToast(errorData, 1)
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con Follow Up Boss');
    }

}
