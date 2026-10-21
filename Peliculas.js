
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3003;

// Películas iniciales
let movies = [
    {
        id: 1,
        title: 'Transformers',
        description: 'Película de acción y ciencia ficción sobre robots que pueden transformarse en vehículos',
        votes: 0
    },
    {
        id: 2,
        title: 'Pacific Rim',
        description: 'Película de ciencia ficción sobre robots gigantes que luchan contra monstruos',
        votes: 0
    },
    {
        id: 3,
        title: 'Scary Movie',
        description: 'Comedia que parodia películas de terror',
        votes: 0
    }
];

// GET /movies - Listar todas las películas
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

// POST /vote/:id - Votar por una película
app.post('/vote/:id', (req, res) => {
    const id = Number(req.params.id);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Película no encontrada.' });
    }

    movie.votes++;

    res.status(200).json({
        message: 'Voto registrado correctamente.'
    });
});

// GET /movie/:id - Consultar una película
app.get('/movie/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Película no encontrada.' });
    }

    res.status(200).json(movie);
});

// GET /result - Películas ordenadas por votos
app.get('/result', (req, res) => {
    const results = [...movies]
        .sort((a, b) => b.votes - a.votes)
        .map(({ id, title, votes }) => ({ id, title, votes }));

    res.status(200).json(results);
});

// POST /movies - Agregar una película
app.post('/movies', (req, res) => {
    const { title, description } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim()
    ) {
        return res.status(400).json({
            message: 'El título y la descripción son obligatorios.'
        });
    }

    const newMovie = {
        id: movies.length
            ? Math.max(...movies.map(m => m.id)) + 1
            : 1,
        title: title.trim(),
        description: description.trim(),
        votes: 0
    };

    movies.push(newMovie);

    res.status(201).json(newMovie);
});

// PUT /movies/:id - Modificar una película
app.put('/movies/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).json({ message: 'Película no encontrada.' });
    }

    const { title, description } = req.body;

    if (
        typeof title !== 'string' || !title.trim() ||
        typeof description !== 'string' || !description.trim()
    ) {
        return res.status(400).json({
            message: 'El título y la descripción son obligatorios.'
        });
    }

    movie.title = title.trim();
    movie.description = description.trim();

    res.status(200).json({
        message: 'Película modificada correctamente.',
        movie
    });
});

// DELETE /movies/:id - Eliminar solo si no tiene votos
app.delete('/movies/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    const index = movies.findIndex(m => m.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Película no encontrada.' });
    }

    if (movies[index].votes > 0) {
        return res.status(400).json({
            message: 'No se puede eliminar una película que ya tiene votos.'
        });
    }

    const deletedMovie = movies.splice(index, 1)[0];

    res.status(200).json({
        message: 'Película eliminada correctamente.',
        movie: deletedMovie
    });
});

// Ruta para endpoints inexistentes
app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint no encontrado.' });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

