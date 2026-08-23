package backend.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import backend.model.Partida;

@Repository
public class PartidaRepository {
    //Utilizamos jdbc template para generar las consultas de manera manual teniendo menos abstracción y más control sobre la BD
    private final JdbcTemplate jdbcTemplate;  

    public PartidaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Operaciones:
    //Estas son las operaciones de la base de datos:
    

    public int save(Partida p) {
        return jdbcTemplate.update(
        "INSERT INTO Partidas (tiempo, click_izq, click_der, exp_ganada, fecha_partida, Gamemode_idModo, Usuarios_idUsuarios) VALUES (?, ?, ?, ?, ?, ?, ?)",
        p.getTiempo(),
        p.getClickIzq(),
        p.getClickDer(),
        p.getExpGanada(),
        p.getFechaPartida(),
        p.getIdModo(),
        p.getUsuarioId()  //Cómo se el id del usuario que generó esto en primer lugar ?
    );
    }

}
