import tableModel from "../models/tableModel.js";

//add table
const addtable = async (req, res) => {
  try {
    const existingTable = await tableModel.findOne({ name: req.body.name });
    if (existingTable) {
      return res.json({
        success: false,
        message: "Table with this name already exists",
      });
    }

    const table = new tableModel({
      name: req.body.name,
      capacity: req.body.capacity,
    });

    await table.save();
    res.json({
      success: true,
      message: "Table added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error adding table",
    });
  }
};
//list table
const listtable = async (req, res) => {
  try {
    const tables = await tableModel.find({});
    console.log(`table:`, tables);
    res.json({ success: true, data: tables });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error fetching tables list" });
  }
};

//delete table
const deletetable = async (req, res) => {
  try {
    const table = await tableModel.findById(req.body.id);
    console.log(table);
    await tableModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "table deleted" });
  } catch (error) {
    res.json({ success: false, message: "error" });
  }
};

// edit a table
const edittable = async (req, res) => {
  try {
    const table = await tableModel.findById(req.body.id);
    if (!table) {
      return res.json({
        success: false,
        message: "Table not found",
      });
    }

    const duplicateTable = await tableModel.findOne({
      name: req.body.name,
      _id: { $ne: req.body.id },
    });
    if (duplicateTable) {
      return res.json({
        success: false,
        message: "Table with this name already exists",
      });
    }

    table.name = req.body.name || table.name;
    table.capacity = req.body.capacity || table.capacity;
    await table.save();

    res.json({
      success: true,
      message: "Table updated successfully",
      data: table,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error updating table",
    });
  }
};
// list a specific table
const listSpecifictable = async (req, res) => {
  try {
    const table = await tableModel.findById(req.body.id);
    res.json({ success: true, data: table });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error fetching table" });
  }
};

export { addtable, listtable, deletetable, edittable, listSpecifictable };
