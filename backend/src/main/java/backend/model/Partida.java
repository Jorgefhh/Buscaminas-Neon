package backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Partida {
    //Atributos del objeto:
    private int id = 2;
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

    //Getters y Setters (podría habermelo ahorrado si usaba lombok, pero me colgué de poner eso)
    // Getters y Setters (obligatorios)
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Double getTiempo() { return tiempo; }
    public void setTiempo(Double tiempo) { this.tiempo = tiempo; }

    public Integer getClickIzq() { return clickIzq; }
    public void setClickIzq(Integer clickIzq) { this.clickIzq = clickIzq; }

    public Integer getClickDer() { return clickDer; }
    public void setClickDer(Integer clickDer) { this.clickDer = clickDer; }

    public Integer getExpGanada() { return expGanada; }
    public void setExpGanada(Integer expGanada) { this.expGanada = expGanada; }

    public LocalDateTime getFechaPartida() { return fechaPartida; }
    public void setFechaPartida(LocalDateTime fechaPartida) { this.fechaPartida = fechaPartida; }

    public Integer getIdModo() { return idModo; }
    public void setIdModo(Integer idModo) { this.idModo = idModo; }


    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

}
