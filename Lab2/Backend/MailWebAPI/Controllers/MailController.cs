using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using MailWebAPI.Models;
using Microsoft.Extensions.Configuration;

namespace MailWebAPI.Controllers
{
    [Route("api/{controller}")]
    [ApiController]
    public class MailController : Controller
    {
        private readonly IConfiguration _configuration;

        public MailController(IConfiguration configuration) => _configuration = configuration;

        [HttpGet]
        public IActionResult Get() => Ok("ok");

        [HttpPost]
        public ActionResult Post([FromBody] MailRequest req)
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
                ModelState.AddModelError(nameof(req.MailAddress), $"The address {req.MailAddress} is not a valid email address.");
                return ValidationProblem();
            }
            catch (Exception e)
            {
                ModelState.AddModelError(nameof(req.MailAddress), $"There was an error: {e.Message}");
                return ValidationProblem();
            }

            mail.To.Add(recipient);

            try
            {
                smtpClient.Send(mail);
            }
            catch
            {
                return StatusCode((int)HttpStatusCode.ServiceUnavailable);
            }

            return Ok(req);
        }
    }
}
