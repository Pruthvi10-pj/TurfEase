package turf_api.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import turf_api.entity.Booking;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTurfIdAndBookingDate(Long turfId, LocalDate bookingDate);
}
