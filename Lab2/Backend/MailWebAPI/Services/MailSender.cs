using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace MailWebAPI.Services
{
    public class MailSender
    {
        private readonly string _login;
        private readonly string _password;

        public MailSender(IConfiguration configuration)
        {
            _login = configuration["login"];
            _password = configuration["password"];
        }

        public async Task<bool> TrySendAsync(MailAddress address, string authorName, string body)
        {
            bool isSuccessful = true;

            try
            {
                SmtpClient client = new("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(_login, _password),
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    EnableSsl = true
                };

                MailMessage mail = new()
                {
                    From = new MailAddress(_login, authorName),
                    Body = body,
                    To = { address },
                    IsBodyHtml = true
                };

                await client.SendMailAsync(mail);
            }
            catch (Exception)
            {
                // TODO: log exception
                isSuccessful = false;
            }

            return isSuccessful;
        }
    }
}
