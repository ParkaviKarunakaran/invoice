const express = require('express');
const router = express.Router();
const db = require('../models');
const Item = db.items;

// Create a new item
// router.post('/item', async (req, res) => {
//     try {
//         const item = await Item.create({
//             item_id: req.body.item_id,
//             name: req.body.name,
//             description: req.body.description,
//             price: req.body.price,
//             cgst: req.body.cgst,
//             sgst: req.body.sgst,
//             discount: req.body.discount
//         });
//         res.status(201).json(item);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// Get items by item_id
router.get('/item/:item_id', async (req, res) => {
    try {
        const items = await Item.findAll({ where: { item_id: req.params.item_id } });
        if (items.length > 0) {
            res.status(200).json(items);
        } else {
            res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/item', async (req, res) => {
    try {
        console.log('Request body:', req.body); // Log the request body
        const { item_id, name, description, price } = req.body;

        if (!item_id || !name || !description || !price) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newItem = await Item.create({ item_id, name, description, price });
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
