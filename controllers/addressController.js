import addressModel from "../models/addressModel.js";


const addAddress = async (req,res) => {

    const {customerId, districtName, wardName, exactAddress, isDefault} = req.body;
    console.log(req.body);
    if(!customerId) 
    {
        return res.status(400).json({success: false, message: "Customer ID không có"});
    }
    const address = new addressModel(
        {
            customerId,
            district: districtName,
            ward: wardName,
            exactAddress,
            isDefault: isDefault || false
        }
    )
    
    await address.save();
    res.json({success: true, message: "Thêm địa chỉ mới thành công"});

}

const fetchAddress = async (req,res) => {
    const {customerId} = req.body;
    if(!customerId)
    {
        return res.status(400).json({success: false, message: "Customer ID không có"});
    }
    const addresses = await addressModel.find({customerId});
    res.json({success: true, data: addresses});
}


const setDefault = async (req, res) => {
    const { addressId, customerId } = req.body;
    if (!addressId || !customerId) {
        return res.status(400).json({ success: false, message: "Address ID và Customer ID không có" });
    }

    try {
        // Find the address by ID
        const address = await addressModel.findById(addressId);
        if (!address) {
            return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
        }

        // Ensure only one default address per user
        await addressModel.updateMany({ customerId: customerId, isDefault: true }, { isDefault: false });

        // Set the selected address as default
        address.isDefault = true;
        await address.save();

        return res.json({ success: true, message: "Đặt địa chỉ mặc định thành công" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
    }
};


const deleteAddress = async (req,res) => {
    const {addressId} = req.body;
    if( !addressId)
    {
        return res.status(400).json({success: false, message: "Address ID không có"});
    }
    await addressModel.findByIdAndDelete(addressId);
    return res.json({success: true, message: "Xóa địa chỉ thành công"});
}

const getDefaultAddress = async (req, res) => {
    const {customerId} = req.body;
    if(!customerId)
    {
        return res.status(400).json({success: false, message: "Customer ID không có"});
    }
    const address = await addressModel.findOne({customerId, isDefault: true});
    return res.json({success: true, data: address});
}


export {addAddress, fetchAddress, setDefault, deleteAddress, getDefaultAddress};  


