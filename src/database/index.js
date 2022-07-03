const api = require("../environment/api");

class Databse {
    async show(session) {
        const apiResult = await api.get(`patient/${session}`);

        return apiResult.data;
    }

    async plan(namePlan) {
        const plan = await api.get(`plans/${namePlan}`);

        //Tratando erro
        if(plan.data.error){
            console.log(plan.data.error)
            return { error: plan.data.error }
        }
        
        return plan.data;
    }

    async specialty(nameSpecialty) {
        const specialty = await api.get(`specialties/${nameSpecialty}`);

        //Tratando erro
        if(specialty.data.error){
            console.log(specialty.data.error)
            return { error: specialty.data.error }
        }
        
        return specialty.data;
    }

    async doctors(plan_id, specialty_id) {
        const doctors = await api.get(`doctor-plan-specialty/${plan_id}/${specialty_id}`);

        //Tratando erro
        if(doctors.data.error){
            console.log(doctors.data.error)
            return { error: doctors.data.error }
        }
        
        return doctors.data;
    }

    async calendars(doctor_id) {
        const calendars = await api.get(`calendars/${doctor_id}`);

        //Tratando erro
        if(calendars.data.error){
            console.log(calendars.data.error)
            return { error: calendars.data.error }
        }
        
        return calendars.data;
    }

    async createClient (data) {
        const apiResult = await api.post("patient", {
        ...data
        });

        //Tratando erro
        if(apiResult.data.error){
            console.log(apiResult.data.error)
            return { error_when_register: apiResult.data.error }
        }

        return data;
    }

    async sendAPI(data) {

        await api.post("appointment", {
            ...data
          });
    }
}

module.exports = Databse;