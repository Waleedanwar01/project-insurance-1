from django.core.management.base import BaseCommand
from django.utils import timezone

from pages.models import CarInsuranceQuotesPage


class Command(BaseCommand):
    help = "Seed the Car Insurance Quotes page content into the database"

    def handle(self, *args, **options):
        data = {
            "title": "Car Insurance Quotes",
            "last_updated": timezone.datetime(2023, 5, 29).date(),
            "intro_paragraphs": [
                "No matter who you are, if you plan to drive a vehicle in the United States, you must have proper car insurance. Not only will it protect you and your family from expensive disasters on the road, but it is required by law! Car insurance will not only financially protect you from the perils of the road (collisions, theft, vandalism, natural disasters, etc.), but it will also protect other drivers on the road, thus limiting your liability. This is why having auto insurance is so important.",
                "Yes, car insurance is a required expense for everybody who wants to drive in the United States. But, just because it is an expense does not mean it needs to be expensive. You can save money on this otherwise difficult-to-afford service by getting car insurance quotes from multiple companies.",
                "This is where Insurance Panda comes in. We realize that shopping around on all insurance sites can be quite tiring and time-consuming. So, we do this for you – we consolidate all these quotes to simplify the whole process. Instead of running around getting quotes from every insurance site and company on the internet, you can just come to us and get quotes from all of them here.",
            ],
            "takeaways": [
                "Car insurance is mandatory for all drivers in the United States and provides financial protection in case of accidents, theft, vandalism, and natural disasters. It also limits your liability and protects other drivers on the road.",
                "While car insurance is an expense, it doesn’t have to be expensive. You can save money on this necessary service by obtaining quotes from multiple companies.",
                "Insurance Panda offers a car insurance quote comparison tool that simplifies shopping for insurance. By entering your zip code and filling out a simple form, you can receive quotes from top insurance providers, making it easier to compare rates and choose the most affordable option.",
                "Several factors affect car insurance rates, including the value and type of your vehicle, safety ratings and features, repair costs, your location, driving record, credit score, and various discounts. Understanding these factors can help you make informed decisions and potentially lower your insurance premiums",
            ],
            "state_insurance_data": [
                {"state": "Alabama", "reqs": "25/50/25", "minRate": 483, "fullRate": 1713},
                {"state": "Alaska", "reqs": "50/100/25", "minRate": 426, "fullRate": 1325},
                {"state": "Arizona", "reqs": "15/30/10", "minRate": 596, "fullRate": 1869},
                {"state": "Arkansas", "reqs": "25/50/25", "minRate": 495, "fullRate": 1914},
                {"state": "California", "reqs": "15/30/5", "minRate": 636, "fullRate": 2065},
                {"state": "Colorado", "reqs": "25/50/15", "minRate": 636, "fullRate": 2016},
                {"state": "Connecticut", "reqs": "25/50/20", "minRate": 891, "fullRate": 2168},
                {"state": "Delaware", "reqs": "25/50/10", "minRate": 839, "fullRate": 2389},
                {"state": "Florida", "reqs": "10/20/10", "minRate": 1101, "fullRate": 3230},
                {"state": "Georgia", "reqs": "25/50/25", "minRate": 773, "fullRate": 2201},
                {"state": "Hawaii", "reqs": "20/40/10", "minRate": 345, "fullRate": 1127},
                {"state": "Idaho", "reqs": "25/50/15", "minRate": 337, "fullRate": 1018},
                {"state": "Illinois", "reqs": "25/50/20", "minRate": 484, "fullRate": 1485},
                {"state": "Indiana", "reqs": "25/50/25", "minRate": 372, "fullRate": 1254},
                {"state": "Iowa", "reqs": "20/40/15", "minRate": 293, "fullRate": 1260},
                {"state": "Kansas", "reqs": "25/50/25", "minRate": 462, "fullRate": 1698},
                {"state": "Kentucky", "reqs": "25/50/25", "minRate": 802, "fullRate": 2128},
                {"state": "Louisiana", "reqs": "15/30/25", "minRate": 912, "fullRate": 3348},
                {"state": "Maine", "reqs": "50/100/25", "minRate": 312, "fullRate": 965},
                {"state": "Maryland", "reqs": "30/60/15", "minRate": 872, "fullRate": 2131},
                {"state": "Massachusetts", "reqs": "20/40/5", "minRate": 429, "fullRate": 1262},
                {"state": "Michigan", "reqs": "20/40/10", "minRate": 1104, "fullRate": 2691},
                {"state": "Minnesota", "reqs": "30/60/10", "minRate": 557, "fullRate": 1643},
                {"state": "Mississippi", "reqs": "25/50/25", "minRate": 508, "fullRate": 1782},
                {"state": "Missouri", "reqs": "25/50/25", "minRate": 491, "fullRate": 1715},
                {"state": "Montana", "reqs": "25/50/20", "minRate": 386, "fullRate": 1589},
                {"state": "Nebraska", "reqs": "25/50/25", "minRate": 364, "fullRate": 1481},
                {"state": "Nevada", "reqs": "25/50/20", "minRate": 827, "fullRate": 2246},
                {"state": "New Hampshire", "reqs": "*25/50/25", "minRate": 312, "fullRate": 965},
                {"state": "New Jersey", "reqs": "15/30/5", "minRate": 865, "fullRate": 2324},
                {"state": "New Mexico", "reqs": "25/50/10", "minRate": 462, "fullRate": 1498},
                {"state": "New York", "reqs": "25/50/10", "minRate": 867, "fullRate": 2321},
                {"state": "North Carolina", "reqs": "30/60/25", "minRate": 372, "fullRate": 1254},
                {"state": "North Dakota", "reqs": "25/50/25", "minRate": 298, "fullRate": 1269},
                {"state": "Ohio", "reqs": "25/50/25", "minRate": 368, "fullRate": 1034},
                {"state": "Oklahoma", "reqs": "25/50/25", "minRate": 507, "fullRate": 1873},
                {"state": "Oregon", "reqs": "25/50/20", "minRate": 741, "fullRate": 1765},
                {"state": "Pennsylvania", "reqs": "15/30/5", "minRate": 427, "fullRate": 1476},
                {"state": "Rhode Island", "reqs": "25/50/25", "minRate": 759, "fullRate": 2110},
                {"state": "South Carolina", "reqs": "25/50/25", "minRate": 557, "fullRate": 1787},
                {"state": "South Dakota", "reqs": "25/50/25", "minRate": 300, "fullRate": 1542},
                {"state": "Tennessee", "reqs": "25/50/15", "minRate": 413, "fullRate": 1399},
                {"state": "Texas", "reqs": "30/60/25", "minRate": 693, "fullRate": 2050},
                {"state": "Utah", "reqs": "25/65/15", "minRate": 636, "fullRate": 1566},
                {"state": "Vermont", "reqs": "25/50/10", "minRate": 343, "fullRate": 995},
                {"state": "Virginia", "reqs": "25/50/20", "minRate": 413, "fullRate": 1304},
                {"state": "Washington", "reqs": "25/50/10", "minRate": 693, "fullRate": 1589},
                {"state": "West Virginia", "reqs": "25/50/25", "minRate": 491, "fullRate": 1456},
                {"state": "Wisconsin", "reqs": "25/50/10", "minRate": 364, "fullRate": 1239},
                {"state": "Wyoming", "reqs": "25/50/20", "minRate": 298, "fullRate": 1577},
            ],
            "faqs": [
                {
                    "id": "safe-online",
                    "question": "Is getting a car insurance quote online safe?",
                    "answer": "Getting insurance quotes online is generally safe if you use a reputable website or company. Buying a policy online is secure and convenient, and you can often do it directly through an insurance company website or an online marketplace. However, you should always research and check any website’s legitimacy before purchasing. You should also be careful about providing accurate and complete information when getting a quote, as any errors or omissions could affect the final price of your policy."
                },
                {
                    "id": "credit-check",
                    "question": "Do you need a credit check to get a car insurance quote online?",
                    "answer": "Insurance companies usually perform a \"soft pull\" of your credit report to generate a quote, which does not impact your credit score. A full, hard credit check is typically only performed if you decide to purchase and finalize the policy."
                },
                {
                    "id": "free-quote",
                    "question": "Is getting a car insurance quote online free?",
                    "answer": "Yes, getting a car insurance quote online from reliable comparison tools like Insurance Panda is typically free. The goal is to provide you with comparison rates without any obligation to purchase."
                },
                {
                    "id": "personal-info",
                    "question": "Do you need to use your personal information to get an insurance quote?",
                    "answer": "You will need to provide basic information such as your name, address, date of birth, and vehicle details to get an accurate quote. This is necessary for insurers to assess your risk and calculate premiums based on factors like age and location. Always ensure the website has a clear privacy policy."
                },
                {
                    "id": "ssn",
                    "question": "Do you need to provide your social security number (SSN) to get an insurance quote?",
                    "answer": "No, you do not need to provide your Social Security Number (SSN) to get a quick quote. While some insurers may request it later if you decide to purchase a policy (for running a detailed credit report), a quote tool like Insurance Panda will not require it upfront."
                },
                {
                    "id": "validity",
                    "question": "How long are car insurance quotes valid for?",
                    "answer": "Car insurance quotes are typically valid for 30 to 60 days. However, this can vary by insurer and state. If your driving record or personal information changes (e.g., a ticket, new address), the quote may no longer be accurate, even if it’s within the validity period."
                },
                {
                    "id": "high-quotes",
                    "question": "Why are my car insurance quotes so high?",
                    "answer": "High quotes can be due to several factors, including a poor driving record (tickets or accidents), a low credit score, living in a high-risk ZIP code, driving a vehicle that is expensive to repair, being a young driver, or choosing high coverage limits. Comparing quotes from multiple providers can often help you find a more affordable option."
                },
            ],
            "author_name": "James Shaffer",
            "author_bio": "James Shaffer is a writer for InsurancePanda.com and a well-seasoned auto insurance industry veteran. He has a deep knowledge of insurance risks and regulations and is passionate about helping drivers save money on auto insurance. He is responsible for researching and writing about anything auto insurance-related. He holds a bachelor’s degree from Bentley University, and his work has been quoted by NBC News, CNN, and The Washington Post.",
            "author_image_url": "/images/james-shaffer.png",
        }

        obj, created = CarInsuranceQuotesPage.objects.update_or_create(
            id=1, defaults=data
        )

        if created:
            self.stdout.write(self.style.SUCCESS("Car Insurance Quotes page seeded."))
        else:
            self.stdout.write(self.style.SUCCESS("Car Insurance Quotes page updated."))