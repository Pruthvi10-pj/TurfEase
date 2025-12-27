package contact_api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;


@Entity
@Table(name = "Contact_us_details")
public class Contact {
	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "feedback_seq")
    @SequenceGenerator(name = "feedback_seq", sequenceName = "feedback_seq", allocationSize = 1)
	@Column(name = "feedback_id")
	private int id;
	
	@Column(name ="full_name")
	private String fullname;
	
	@Column(name = "phone_no")
	private long phone;
	
	@Column(name = "email_id")
	private String email;
	
	@Column(name = "city_name")
	private String city;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "reasons")
	public Reason reason;
	
	@Column(name = "feedback_message", length = 1000)
	public String message;
	
	public Contact(int id,String fullname, long phone, String email, String city, Reason reason, String message) {
		super();
		this.id = id;
		this.fullname = fullname;
		this.phone = phone;
		this.email = email;
		this.city = city;
		this.reason = reason;
		this.message = message;
	}
	
	

	public Contact() {
		super();
		// TODO Auto-generated constructor stub
	}



	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public long getPhone() {
		return phone;
	}

	public void setPhone(long phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Reason getReason() {
		return reason;
	}

	public void setReason(Reason reason) {
		this.reason = reason;
	}



	public String getMessage() {
		return message;
	}



	public void setMessage(String message) {
		this.message = message;
	}



	@Override
	public String toString() {
		return "Contact [id=" + id + ", fullname=" + fullname + ", phone=" + phone + ", email=" + email + ", city="
				+ city + ", reason=" + reason + ", message=" + message + "]";
	}
	
	
	
	
	
	
	
	
	
	
}
