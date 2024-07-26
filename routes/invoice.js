const express = require('express');
const router = express.Router();
const db = require('../models');
const Item = db.items;

// Get items by item_id or name
router.get('/item', async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({ error: "Search term is required" });
        }

        const items = await Item.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { item_id: search },
                    { name: { [db.Sequelize.Op.iLike]: `%${search}%` } }  // Case-insensitive search for item name
                ]
            }
        });

        if (items.length > 0) {
            res.status(200).json(items);
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new item
router.post('/item', async (req, res) => {
    try {
        const { item_id, name, description, price, cgst, sgst } = req.body;

        if (!item_id || !name || !description || !price || cgst === undefined || sgst === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newItem = await Item.create({ item_id, name, description, price, cgst, sgst });
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update an item
router.put('/item/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const updatedItem = req.body;

    try {
        const [updated] = await Item.update(updatedItem, { where: { item_id: itemId } });

        if (updated === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item updated successfully' });
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete an item
router.delete('/item/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        const deleted = await Item.destroy({ where: { item_id: itemId } });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
