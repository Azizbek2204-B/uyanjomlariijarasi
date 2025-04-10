const sequelize = require("../config/db");
const { QueryTypes } = require("sequelize");

const getRentedProducts = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const products = await sequelize.query(`
        SELECT p.id, p.name, c.begin_date, c.end_date
        FROM products p
        JOIN contracts c ON p.id = c."productId"
        WHERE c.begin_date >= :startDate AND c.end_date <= :endDate
        `, {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });
        res.json(products);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Xatolik yuz berdi");
    }
  };  
  
  

  const getDamagedClients = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        const results = await sequelize.query(`
        SELECT cl.id, cl.username, cl.email, s.name AS status, c.begin_date, c.end_date
        FROM clients cl
        JOIN contracts c ON cl.id = c."clientId"
        JOIN statuses s ON c."statusId" = s.id
        WHERE s.name = 'damaged'
        AND c.begin_date >= :startDate AND c.end_date <= :endDate
        `, {
            replacements: { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });
        res.json(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Xatolik yuz berdi");
    }
};

const getCancelledClients = async (req, res) => {
    const { startDate, endDate } = req.body;
    try {
        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Boshlanish va tugash sanasi kerak" });
        }

        const clients = await sequelize.query(`
            SELECT cl.id, cl.username, cl.email, s.name AS status, c.begin_date, c.end_date
            FROM clients cl
            JOIN contracts c ON cl.id = c."clientId"
            JOIN statuses s ON c."statusId" = s.id
            WHERE s.name = 'cancelled'
            AND c.begin_date >= :startDate AND c.end_date <= :endDate
        `, {
            replacements: { startDate, endDate },
            type: QueryTypes.SELECT
        });

        res.json(clients);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Xatolik yuz berdi");
    }
};


const getTopOwners = async (req, res) => {
    const { categoryId } = req.body;

    try {
        const owners = await sequelize.query(`
            SELECT o.id, o.username, COUNT(c.id) AS total_rentals
            FROM owners o
            JOIN products p ON o.id = p."owner_id"
            JOIN categories cat ON p."category_id" = cat.id
            JOIN contracts c ON p.id = c."productId"
            WHERE cat.id = :categoryId
            GROUP BY o.id
            ORDER BY total_rentals DESC
            LIMIT 10
        `, {
            replacements: { categoryId },
            type: sequelize.QueryTypes.SELECT
        });

        res.json(owners);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Xatolik yuz berdi");
    }
};


const getClientPayments = async (req, res) => {
    const { clientId } = req.body;
    try {
        const payments = await sequelize.query(`
            SELECT cl.id AS client_id, cl.username, p.name AS product_name, cat.name AS category_name, pa.amount, pa.payment_date
            FROM clients cl
            JOIN contracts c ON cl.id = c."clientId"
            JOIN products p ON c."productId" = p.id
            JOIN categories cat ON p.category_id = cat.id
            JOIN payments pa ON c.id = pa."contractId"
            WHERE cl.id = :clientId
        `, {
            replacements: { clientId },
            type: sequelize.QueryTypes.SELECT
        });

        res.json(payments);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Xatolik yuz berdi");
    }
};

module.exports = {
  getRentedProducts,
  getDamagedClients,
  getCancelledClients,
  getTopOwners,
  getClientPayments
};