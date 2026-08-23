package backend.service;

import org.springframework.stereotype.Service;

import backend.model.Partida;
import backend.repository.PartidaRepository;

@Service
public class PartidaService {
    private final PartidaRepository partidaRepository;

    //Constructor inicializado: A su vez usa un objeto repositorio que es creado automaticamente por spring mediante ioc
    public PartidaService(PartidaRepository partidaRepository){
        this.partidaRepository = partidaRepository;
    }

    public Partida registrarPartida(Partida partida) {
        //Aqui puede incorporar más funcionaldades. Por el momento solo guardar.
        partidaRepository.save(partida);
        return partida;
    }
}
