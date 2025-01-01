import employeeModel from '../models/employeeModel.js'
import accountModel from '../models/accountModel.js'


// add employee item




// all employee list
const listEmployee = async(req,res) => {
    try{
        const employees = await employeeModel.find({});
        res.json({success:true, data: employees})
    }
    catch(error){
        console.log(error);
        res.json({success:false, message: 'error fetching employee list'})
    }
}

// delete a employee
const deleteEmployee = async(req,res) => {
    try{
        
        const account = await accountModel.findOne({userId: req.body.id});
        console.log(account);
        if(account)
        {
            await accountModel.findByIdAndDelete(account._id);
        }

        await employeeModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: 'employee deleted'});


    }
    catch(error)
    {
        res.json({success:false, message: error.message})
    }
}


//edit a employee
const editEmployee = async (req, res) => {
    try {
        await employeeModel.findByIdAndUpdate(
            req.body.id,
            {
                full_name: req.body.fullName,
                phone_number: req.body.phoneNumber,
                address: req.body.address,
                employee_role: req.body.employeeRole,
                socialId: req.body.socialId
            }
        );
        res.json({success: true, message: 'employee updated'});
    }
    catch (error) {
        res.json({success: false, message: error.message});
    }
}

// list a specific employee
const listSpecificEmployee = async (req, res) => {
    try {

        const employee = await employeeModel.findById(req.body.id); 
        if(!employee)
        {
            return res.json({success: false, message: 'employee not found'});
        }
        return res.json({success: true, data: employee});
    }
    catch(error) {
        return res.json({success: false, message: error.message});  
    }
};

export {listEmployee, deleteEmployee, editEmployee, listSpecificEmployee}