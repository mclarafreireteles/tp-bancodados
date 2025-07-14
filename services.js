// services.js
import db from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

// --- Operações de Inserção (INSERT) ---
export async function createUser(userData) {
    const { first_name, last_name, email, password } = userData;
    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const res = await db.query(
        `INSERT INTO users(id, first_name, last_name, email, password_hash) VALUES($1, $2, $3, $4, $5) RETURNING *`,
        [id, first_name, last_name, email, password_hash]
    );
    return res.rows[0];
}

export async function createAdmin(userId) {
    const res = await db.query(`INSERT INTO admins(id, last_access_in) VALUES($1, NOW()) RETURNING *`, [userId]);
    return res.rows[0];
}

export async function createEvent(eventData) {
    const { sport, description, expected_result, admin_id } = eventData;
    const id = uuidv4();
    const res = await db.query(
        `INSERT INTO events(id, sport, description, expected_result, status, stated_on, admin_id) VALUES($1, $2, $3, $4, 'pending', NOW(), $5) RETURNING *`,
        [id, sport, description, expected_result, admin_id]
    );
    return res.rows[0];
}

// --- Operações de Leitura (SELECT) ---
export async function getAllUsers() {
    const res = await db.query(`SELECT id, first_name, last_name, email FROM users`);
    return res.rows;
}

export async function getUserById(id) {
    const res = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return res.rows[0];
}

export async function getGamblerWithTransactions(gamblerId) {
    const res = await db.query(
        `SELECT g.balance, t.type, t.value FROM gamblers g JOIN transactions t ON g.id = t.gambler_id WHERE g.id = $1`,
        [gamblerId]
    );
    return res.rows;
}

export async function getBetsByEvent(eventId) {
    const res = await db.query(
        `SELECT b.id, b.value, b.status, g.registration_date FROM bets b JOIN gamblers g ON b.gambler_id = g.id WHERE b.event_id = $1`,
        [eventId]
    );
    return res.rows;
}

export async function getPendingEvents() {
    const res = await db.query(`SELECT id, sport, description FROM events WHERE status = 'pending'`);
    return res.rows;
}

// --- Operações de Atualização (UPDATE) ---
export async function updateEventResult(eventId, result, status) {
    const res = await db.query(
        `UPDATE events SET result = $1, status = $2, finished_on = NOW() WHERE id = $3 RETURNING *`,
        [result, status, eventId]
    );
    return res.rows[0];
}

export async function updateGamblerBalance(gamblerId, value) {
    const res = await db.query(
        `UPDATE gamblers SET balance = balance + $1 WHERE id = $2 RETURNING *`,
        [value, gamblerId]
    );
    return res.rows[0];
}

// --- Operações de Remoção (DELETE) ---
export async function deleteBet(betId) {
    const res = await db.query(`DELETE FROM bets WHERE id = $1 RETURNING *`, [betId]);
    return res.rows[0];
}

export async function deleteEvent(eventId) {
    // Nota: É importante ter cuidado com DELETE. Dependendo das constraints,
    // talvez você precise remover as apostas (`bets`) primeiro.
    const res = await db.query(`DELETE FROM events WHERE id = $1 RETURNING *`, [eventId]);
    return res.rows[0];
}