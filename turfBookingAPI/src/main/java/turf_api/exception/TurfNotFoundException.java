package turf_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TurfNotFoundException extends RuntimeException{
	public TurfNotFoundException(String errorMessage) {
		super(errorMessage);
	}
}
