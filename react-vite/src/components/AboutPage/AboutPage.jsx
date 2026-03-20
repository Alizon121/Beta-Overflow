import "./AboutPage.css"

function AboutPage() {


    return (
        <div className="flex justify-center p-6">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-2xl p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center">About BetaOverflow</h1>
                <div className="about_content_container">
                    <p>
                        <strong>BetaOverflow</strong> is a forum that allows users to ask questions about rock climbing and hopefully get their questions answered.
                    </p>
                    <p>
                        A user will be able to create a question, post responses, tag quesitons, and save posts to revisit later!
                    </p>
                    <p>
                        Our goal is to build a supportive space for climbers of all levels to share knowledge, techniques, and stories.
                    </p>
                    <h2 className="text-xl font-semibold mt-4">Community Guidelines</h2>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Respect everyone regardless of background or identity.</li>
                        <li>Constructive, kind conversation is encouraged.</li>
                        <li>Harmful behavior may result in a loss of site privileges.</li>
                    </ul>
                    <p className="mt-4 font-semibold text-center">
                        Help make BetaOverflow a welcoming, inclusive, and solution-focused space!
                    </p>
                </div>
        </div>
    </div>
    )

}

export default AboutPage;