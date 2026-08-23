package backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import lombok.Getter;
import lombok.Setter;

@Table("Clasificacion")
@Getter
@Setter
public class Clasificacion {

    @Id
    private Integer id;
    private Double mejorTiempo;
    private LocalDateTime fechaRecord;
    private Integer usuarioId;
    private Integer idModo;
}
