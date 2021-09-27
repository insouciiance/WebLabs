using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using MailWebAPI.Models;
using Microsoft.Extensions.Configuration;

namespace MailWebAPI.Controllers
{
    [Route("api/{controller}")]
    public class MailController : Controller
    {
        private readonly IConfiguration _configuration;

        public MailController(IConfiguration configuration) => _configuration = configuration;

        [HttpPost]
        public IActionResult Post([FromBody] MailRequest req)
        {
            IConfigurationSection credentials = _configuration.GetSection("MailCredentials");
            string login = credentials.GetSection("Login").Value;
            string password = credentials.GetSection("Password").Value;

            SmtpClient smtpClient = new("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(login, password),
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true
            };

            MailMessage mail = new()
            {
                From = new MailAddress(login, req.AuthorName),
                Body = req.Text
            };

            MailAddress recipient;

            try
            {
                recipient = new MailAddress(req.MailAddress);
            }
            catch (FormatException)
            {
                return BadRequest($"The address {req.MailAddress} is not a valid email address.");
            }
            catch (ArgumentNullException)
            {
                return BadRequest($"The mailing address was not filled.");
            }
            catch (ArgumentException)
            {
                return BadRequest($"The mailing address was not filled.");
            }
            catch (Exception e)
            {
                return BadRequest($"There was an error: {e.Message}");
            }

            mail.To.Add(recipient);

            try
            {
                smtpClient.Send(mail);
            }
            catch
            {
                return StatusCode(500);
            }

            return Ok();
        }
    }
}
