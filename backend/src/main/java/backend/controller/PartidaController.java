package backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import backend.model.Partida;
import backend.service.PartidaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("api/partidas")
@CrossOrigin(origins = "*")  // Permite tomar peticiones desde otro origen.
public class PartidaController {
    private final PartidaService partidaService;

    public PartidaController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    @PostMapping()
    //Se ejecuta una serie de operaciones que utilizan como parámetros el body del datagrama http request, el cual contiene los datos.
    public ResponseEntity<Partida> crearPartida(@RequestBody Partida partida){  //Aquí se deserializa el body a un objeto POJO  
        //Invoco al service para que haga la lógica de negocio.
        Partida nueva = partidaService.registrarPartida(partida);
        return ResponseEntity.ok(nueva);
    }
       
    
}
