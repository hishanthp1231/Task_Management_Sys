const { Task, User } = require('../models');

const getTasks = async (req, res) => {
    try {
        let { page = 1, limit = 10, status, search } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const query = {};

        if (req.user.role !== 'admin') {
            query.$or = [
                { created_by_id: req.user.id },
                { assigned_to_id: req.user.id }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const searchCondition = {
                $or: [
                    { title: searchRegex },
                    { description: searchRegex }
                ]
            };

            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { $or: searchCondition.$or }
                ];
                delete query.$or;
            } else {
                query.$or = searchCondition.$or;
            }
        }

        const count = await Task.countDocuments(query);
        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('creator', 'name email')
            .populate('assignee', 'name email');

        res.status(200).json({
            success: true,
            data: {
                tasks,
                pagination: {
                    total: count,
                    page: page,
                    pages: Math.ceil(count / limit),
                    limit: limit
                }
            }
        });
    } catch (error) {
        console.error('Get Tasks Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('assignee', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (req.user.role !== 'admin' &&
            task.created_by_id.toString() !== req.user.id &&
            (task.assigned_to_id && task.assigned_to_id.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this task'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Get Task Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, status, assigned_to_id } = req.body;

        if (assigned_to_id) {
            const assignedUser = await User.findById(assigned_to_id);
            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Assigned user not found'
                });
            }
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            assigned_to_id,
            created_by_id: req.user.id
        });

        const createdTask = await Task.findById(task.id)
            .populate('creator', 'name email')
            .populate('assignee', 'name email');

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: createdTask
        });
    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (req.user.role !== 'admin' && task.created_by_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        const { title, description, status, assigned_to_id } = req.body;

        if (assigned_to_id) {
            const assignedUser = await User.findById(assigned_to_id);
            if (!assignedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'Assigned user not found'
                });
            }
        }

        task.title = title !== undefined ? title : task.title;
        task.description = description !== undefined ? description : task.description;
        task.status = status !== undefined ? status : task.status;
        task.assigned_to_id = assigned_to_id !== undefined ? assigned_to_id : task.assigned_to_id;

        await task.save();

        const updatedTask = await Task.findById(task.id)
            .populate('creator', 'name email')
            .populate('assignee', 'name email');

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask
        });
    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (req.user.role !== 'admin' && task.created_by_id.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete Task Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};
