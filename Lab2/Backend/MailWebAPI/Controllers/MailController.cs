using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;
using Ganss.XSS;
using MailWebAPI.Models;
using MailWebAPI.Services;

namespace MailWebAPI.Controllers
{
    [Route("api/{controller}")]
    [ApiController]
    public class MailController : Controller
    {
        private readonly MailSender _mailSender;

        public MailController(MailSender mailSender) => _mailSender = mailSender;

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] MailRequest req)
        {
            HtmlSanitizer sanitizer = new ();
            string sanitizedHtml = sanitizer.Sanitize(req.Text);

            if (sanitizedHtml == string.Empty)
            {
                ModelState.AddModelError(nameof(req.Text), "Email message must be specified.");
                return ValidationProblem();
            }

            MailAddress recipient = new (req.MailAddress);

            if (!await _mailSender.TrySendAsync(recipient, req.AuthorName, sanitizedHtml))
            {
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            return Ok(new
            {
                req.MailAddress,
                req.AuthorName,
                body = sanitizedHtml
            });
        }
    }
}
