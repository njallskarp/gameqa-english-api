import sgMail from "@sendgrid/mail";
import { AddressInfo, Template } from "./interface";
import { SENDGRID_KEY } from "../../utils";

// initialize sendgrid via key from env
sgMail.setApiKey(SENDGRID_KEY);

export class Sender {
	readonly addressing: AddressInfo;

	/**
	 * Constructs a sender instance by accepting
	 * addressing information about emails being sent
	 *
	 * @param addressInfo The addressing information
	 *    needed to send this particular email
	 */
	public constructor(addressInfo: AddressInfo) {
		this.addressing = addressInfo;
	}

	/**
	 * Sends email to the address info given the
	 * SendGrid template information given
	 * to the send function
	 * @param template the template along with
	 *     dynamic data to send to SendGrid
	 */
	public async send(template: Template) {
		// promisify the send
		return new Promise((resolve, reject) => {
			sgMail.send(
				{
					from: this.addressing.from,
					subject: this.addressing.subject,
					templateId: template.templateId,
					replyTo: this.addressing.replyTo,
					personalizations: [
						{
							// map array of emails to array of {email: string}
							to: this.addressing.to.map((emailString) => ({
								email: emailString,
							})),
							bcc: [],
							dynamicTemplateData: template.data,
						},
					],
				},
				null,
				(error, _) => {
					if (error) return reject(error);
					return resolve(null);
				}
			);
		});
	}
}

// exported constants
export const DEFAULT_SENDER = "noreply@gameqa.app";
export const REGISTER_USER_TEMPLATE = "d-2631f912e5d74bd3b7b2bd5520e23630";
export const RESET_PW_CODE_TEMPLATE = "d-131adb2bc11f4e66a8bafc4e6ddafef2";
export const WEEKLY_WINNERS_TEMPLATE = "d-3c9addb0168445328e035b6244145fcd";
export const EMAIL_GIVEAWAY_ANNOUNCEMENT_TEMPLATE =
	"d-bb06178c3b89497bb867cfcf2fed37ea";
