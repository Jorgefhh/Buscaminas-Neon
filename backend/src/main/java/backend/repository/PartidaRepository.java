package backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import backend.model.Partida;

@Repository
public class PartidaRepository {
    private final JdbcTemplate jdbcTemplate;

    public PartidaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Operaciones:

    public int save(Partida p) {
        return jdbcTemplate.update(
        "INSERT INTO Partidas (tiempo, click_izq, click_der, exp_ganada, fecha_partida, Gamemode_idModo, Usuarios_idUsuarios) VALUES (?, ?, ?, ?, ?, ?, ?)",
        p.getTiempo(),
        p.getClickIzq(),
        p.getClickDer(),
        p.getExpGanada(),
        p.getFechaPartida(),
        p.getIdModo(),
        p.getUsuarioId()
    );
    }

}
