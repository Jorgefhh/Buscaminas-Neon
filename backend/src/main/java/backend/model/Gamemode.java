package backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Table("Gamemode")
@Getter
@Setter
public class Gamemode {
    @Id
    private Integer idModo;
    private String nombre;
    private String descripcion;
}
