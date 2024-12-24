import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: "Your comment is required",
        max: 255,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    point: {
        type: Number,
        required: true,
    },
    isEdited: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Add index for efficient filtering
commentSchema.index({ point: 1 });
commentSchema.index({ customerId: 1 });

const commentModel = mongoose.models.comment || mongoose.model("comment", commentSchema);

export default commentModel;