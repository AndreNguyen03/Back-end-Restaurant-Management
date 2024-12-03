import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: 'Your full name is required',
        max: 134
    },
    phone_number: {
        type: String,
        required: 'Your phone number is required',
        max: 10
    },
    address: {
        type: String,
        required: 'Your address is required',
        max: 255
    },
    employee_role: {
        type: String,
        required: 'Your role is required',
        max: 20
    },
    socialId: {
        type: String,
        required: 'Your social id is required',
        max: 20
    }

})

const employeeModel = mongoose.models.employee || mongoose.model('employee', employeeSchema)

export default employeeModel;