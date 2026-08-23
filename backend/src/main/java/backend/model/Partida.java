package backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
//@Entity error : entity solo se usa en jpa hibernate
@Table("Partidas")
@Getter
@Setter
public class Partida {
    //Atributos del objeto:
    @Id
    private Integer id;  //Este id en teoría se debería generar en la base de datos 
    
    private Double tiempo;

    //Uso @JsonProperty porque desde JS me llega "click_izq" (snake case)
    //Pero yo quiero usar camel case
    @JsonProperty("click_izq")
    private Integer clickIzq;

    @JsonProperty("click_der")
    private Integer clickDer;

    @JsonProperty("exp_ganada")
    private Integer expGanada;
    
    @JsonProperty("fecha_partida")
    private LocalDateTime fechaPartida;

    @JsonProperty("Gamemode_idModo")
    private Integer idModo;

    @JsonProperty("Usuarios_idUsuarios")
    private Integer usuarioId;

    public Partida(){}

    

}
