// ==========================================
// CARDS DATABASE — Inspired by "New Phone, Who Dis?"
// 50 Inbox Messages + 115 Reply Cards
// Each inbox has 12-15 mapped "relevant" replies
// ==========================================

const inboxData = [
  // --- CLASSIC / RELATIONSHIP ---
  {
    message: "I think we should see other people.",
    relevant: ["New phone, who dis?", "I've been seeing other people since Tuesday.", "That is no way to talk to your father.", "K.", "Finally.", "Before I reply, you should know I'm 9.", "This is actually his wife.", "I'm not surprised, just disappointed.", "Bold of you to assume I care.", "Per my last text...", "Delivered ✓✓ (but choosing not to respond)", "I'm forwarding this to your mother.", "We're done here."]
  },
  {
    message: "I'm pregnant.",
    relevant: ["New phone, who dis?", "That is no way to talk to your mother.", "My lawyer will be in touch.", "I'm telling your dad.", "Congratulations! Is it mine?", "Before I reply, you should know I'm 9.", "This is actually her husband.", "I just threw up a little.", "I'm literally shaking rn.", "I'm too sober for this.", "That's between you and God.", "I'm going to need you to never contact me again.", "Wrong person. But also, yes."]
  },
  {
    message: "Don't freak out, but I just got a tattoo of your name on my lower back.",
    relevant: ["We've only been on one date.", "I'm calling the police.", "Which name did you use?", "That is no way to talk to your therapist.", "I'm literally shaking rn.", "I have a restraining order against you.", "I'm not even mad, I'm impressed.", "Pics or it didn't happen.", "I'm going to need you to never contact me again.", "My therapist warned me about people like you.", "I just showed this to everyone at work.", "Bold of you to assume I care."]
  },
  {
    message: "I'm outside your house.",
    relevant: ["I'm calling 911.", "New phone, who dis?", "Sir, this is a Wendy's.", "I don't even live there anymore.", "Please leave the pizza on the doorstep.", "I have a restraining order against you.", "This conversation is being recorded.", "I'm currently being held hostage, please send help.", "Before I reply, you should know I'm 9.", "I'm sitting right next to you.", "That's between you and God.", "I need an adult."]
  },
  {
    message: "Are we still on for our date tonight?",
    relevant: ["I'd rather eat glass.", "New phone, who dis?", "Depends. Are you paying?", "I'm currently in a high-speed chase, can I call you back?", "Only if we go somewhere your ex won't see us.", "Before I reply, you should know I'm 9.", "I'm currently in witness protection.", "I have diarrhea.", "This is actually his wife.", "I'm in the emergency room, but go on.", "Crocs and socks.", "lol wrong person sorry"]
  },
  {
    message: "You up?",
    relevant: ["Sir, this is a Wendy's.", "I'm calling the police.", "Grandma, did you send this to the wrong person again?", "It's 2 PM.", "Blocked.", "Before I reply, you should know I'm 9.", "I have a restraining order against you.", "This is actually her husband.", "I'm going to need you to never contact me again.", "Delivered ✓✓ (but choosing not to respond)", "I'm not surprised, just disappointed.", "Read 4:37 PM.", "Per my last text..."]
  },
  {
    message: "I love you.",
    relevant: ["I love me too.", "That's unfortunate.", "K.", "New phone, who dis?", "Please refer all complaints to my therapist.", "Before I reply, you should know I'm 9.", "This is actually his wife.", "lol wrong person sorry", "Noted. Anyway, what's for dinner?", "I'm too sober for this.", "Bold of you to assume I care.", "That's between you and God."]
  },
  {
    message: "My mom wants to meet you.",
    relevant: ["Tell her I said no.", "I'm currently in witness protection.", "I'd rather eat glass.", "Which one? I have several moms.", "Can she cook?", "I'm literally at your mom's house right now.", "I'm going to need you to never contact me again.", "Before I reply, you should know I'm 9.", "Is this a threat?", "I have diarrhea.", "I'm not surprised, just disappointed.", "That is no way to talk to your dentist."]
  },

  // --- CHAOS / EMERGENCY ---
  {
    message: "I'm at the hospital.",
    relevant: ["That sounds like a you problem.", "Thoughts and prayers 🙏", "Can I have your Xbox?", "Again?", "Did you try turning it off and on again?", "I'm in the emergency room, but go on.", "Noted. Anyway, what's for dinner?", "Which hospital? I need to update my will.", "I'm on my way! 🏃‍♂️💨", "Was it worth it?", "This is why we can't have nice things.", "God has a plan.", "Cool story bro."]
  },
  {
    message: "I need bail money.",
    relevant: ["New phone, who dis?", "How much and what did you do this time?", "I'm on a budget.", "Venmo or Cash App?", "My lawyer will be in touch.", "That sounds like a you problem.", "You still owe me from 2019.", "I'm currently in a high-speed chase, can I call you back?", "I'll pray for you.", "Again?", "Blocked.", "This conversation is being recorded.", "Was it worth it?"]
  },
  {
    message: "I think someone is in my house.",
    relevant: ["That sounds like a you problem.", "Have you tried asking them to leave politely?", "Thoughts and prayers 🙏", "Is he cute?", "I'm literally hiding in the bathroom, please send help.", "I'm at your front door.", "I'm sitting right next to you.", "I'm currently being held hostage, please send help.", "That's between you and God.", "I'm calling the police.", "Sorry, my parrot typed that.", "Before I reply, you should know I'm 9."]
  },
  {
    message: "I just crashed your car.",
    relevant: ["I'm literally shaking rn.", "My lawyer will be in touch.", "That wasn't my car.", "I'm calling the police.", "You're paying for my therapy.", "This conversation is being recorded.", "I'm not even mad, I'm impressed.", "Was it worth it?", "Again?", "I'm going to need you to never contact me again.", "This is why we can't have nice things.", "I just threw up a little."]
  },
  {
    message: "Guess who just got arrested?",
    relevant: ["Was it worth it?", "I'm not bailing you out again.", "Thoughts and prayers 🙏", "Pics or it didn't happen.", "Your mom is gonna kill you.", "Again?", "I'm not even mad, I'm impressed.", "This conversation is being recorded.", "I just showed this to everyone at work.", "My lawyer will be in touch.", "I'm forwarding this to your mother.", "That sounds like a you problem."]
  },
  {
    message: "I'm being chased by a goose.",
    relevant: ["You're on your own.", "That sounds like a you problem.", "RUN.", "I'm literally crying right now 😂", "Have you tried reasoning with it?", "Pics or it didn't happen.", "I'm not even mad, I'm impressed.", "That's between you and God.", "I'll pray for you.", "Sorry, my parrot typed that.", "I'm too sober for this.", "How did you even get there?"]
  },

  // --- SOCIAL / AWKWARD ---
  {
    message: "I think I just sent a nude to the family group chat.",
    relevant: ["Grandma says nice lighting.", "Your uncle already responded.", "Time to fake your death.", "I'm literally shaking rn.", "You're paying for my therapy.", "I just showed this to everyone at work.", "This is why we can't have nice things.", "I'm forwarding this to your mother.", "I've seen your search history, you can't judge me.", "I'm not surprised, just disappointed.", "My FBI agent already saw it.", "I'm dead. 💀"]
  },
  {
    message: "I accidentally liked your ex's photo from 2014.",
    relevant: ["Time to fake your death.", "You're dead to me.", "We're done here.", "That's actually impressive dedication.", "I'm literally crying right now 😂", "I'm not even mad, I'm impressed.", "I just showed this to everyone at work.", "This is why we can't have nice things.", "Bold of you to assume I care.", "I'm dead. 💀", "I'm going through something.", "lol wrong person sorry"]
  },
  {
    message: "Can you delete my browser history?",
    relevant: ["I'm telling your mom.", "What did you do?", "My FBI agent already saw it.", "I'd rather not know.", "My lawyer will be in touch.", "I've seen your search history, you can't judge me.", "This conversation is being recorded.", "I'm forwarding this to your mother.", "That's between you and God.", "I'll pray for you.", "You need Jesus.", "Before I reply, you should know I'm 9."]
  },
  {
    message: "Why is there a police car outside your house?",
    relevant: ["Mind your business.", "That's not a police car, that's my Uber.", "I'm not at liberty to discuss that.", "My lawyer will be in touch.", "I'm literally hiding in the bathroom, please send help.", "This conversation is being recorded.", "That is no way to talk to your Uber driver.", "I'm currently in witness protection.", "I blacked out, what happened?", "Wrong chat.", "Per my last text...", "I have a restraining order against you."]
  },
  {
    message: "Did you just unfollow me?",
    relevant: ["New phone, who dis?", "It was an accident... or was it?", "I'm going through a social media cleanse.", "You'll survive.", "Blocked.", "Bold of you to assume I care.", "Delivered ✓✓ (but choosing not to respond)", "Per my last text...", "K.", "I'm not surprised, just disappointed.", "Leave me alone.", "That sounds like a you problem."]
  },

  // --- ABSURD / FUNNY ---
  {
    message: "I just ate your leftovers.",
    relevant: ["You're paying for my therapy.", "I'm calling the police.", "That was my emotional support lasagna.", "We can never be friends again.", "My lawyer will be in touch.", "I have a restraining order against you.", "This is why we can't have nice things.", "I'm going to need you to never contact me again.", "Was it worth it?", "I'm literally shaking rn.", "I'm dead. 💀", "We're done here."]
  },
  {
    message: "Where is the G-spot located?",
    relevant: ["I don't know but will I need my inhaler?", "Sir, this is a Wendy's.", "Have you tried Google Maps?", "That is no way to talk to your doctor.", "I'm calling HR.", "Before I reply, you should know I'm 9.", "That is no way to talk to your dentist.", "That's between you and God.", "I'm forwarding this to your mother.", "Grandma, did you send this to the wrong person again?", "This conversation is being recorded.", "Please refer all complaints to my therapist."]
  },
  {
    message: "I just saw a UFO.",
    relevant: ["Pics or it didn't happen.", "Are you drunk?", "Did it look like your ex?", "I'm literally shaking rn.", "Stop eating edibles.", "I'm not even mad, I'm impressed.", "I'm too sober for this.", "My FBI agent already saw it.", "That sounds like a you problem.", "I blacked out, what happened?", "Cool story bro.", "I'm going through something."]
  },
  {
    message: "Do you think aliens are real?",
    relevant: ["Sir, this is a Wendy's.", "I AM the alien.", "Are you drunk?", "Only on Tuesdays.", "That is no way to talk to your mother.", "Before I reply, you should know I'm 9.", "I'm too sober for this.", "Stop eating edibles.", "That's between you and God.", "Bold of you to assume I care.", "Please refer all complaints to my therapist.", "I'm in a meeting."]
  },
  {
    message: "I just found $100 on the ground.",
    relevant: ["That's mine, I dropped it.", "Venmo me half.", "God has a plan.", "Pics or it didn't happen.", "Is this a scam?", "I'm on my way! 🏃‍♂️💨", "I'm on a budget.", "I'm not even mad, I'm impressed.", "You still owe me from 2019.", "My bank account is crying right now.", "This is actually his wife.", "Noted. Anyway, what's for dinner?"]
  },

  // --- WORKPLACE / SCHOOL ---
  {
    message: "I told my boss you'd cover for me.",
    relevant: ["I'd rather eat glass.", "That sounds like a you problem.", "I don't even work there.", "My lawyer will be in touch.", "I'm calling HR.", "I'm currently in a high-speed chase, can I call you back?", "Bold of you to assume I care.", "Per my last text...", "I have diarrhea.", "I'm in a meeting.", "This conversation is being recorded.", "I'm going to need you to never contact me again."]
  },
  {
    message: "I just got fired.",
    relevant: ["Thoughts and prayers 🙏", "Finally.", "Can I have your parking spot?", "That sounds like a you problem.", "I'm literally crying right now 😂", "Was it worth it?", "I'm not surprised, just disappointed.", "Again?", "Noted. Anyway, what's for dinner?", "God has a plan.", "Your mom is gonna kill you.", "I'll pray for you."]
  },
  {
    message: "My professor just emailed me at 3 AM.",
    relevant: ["That is no way to talk to your student.", "Block them.", "Are you sure it wasn't a ghost?", "I'm calling HR.", "Thoughts and prayers 🙏", "I have a restraining order against you.", "This conversation is being recorded.", "Per my last text...", "I'm too sober for this.", "Read 4:37 PM.", "Is this a threat?", "My therapist warned me about people like you."]
  },
  {
    message: "I'm quitting my job to become an influencer.",
    relevant: ["You have 12 followers.", "That sounds like a you problem.", "Your mom is gonna kill you.", "I'm calling the police.", "Thoughts and prayers 🙏", "I'm not surprised, just disappointed.", "Bold of you to assume I care.", "I'll pray for you.", "My bank account is crying right now.", "I'm dead. 💀", "This is why we can't have nice things.", "I'm going through something."]
  },

  // --- FRIENDS / SOCIAL ---
  {
    message: "Can I borrow $500? I promise I'll pay you back.",
    relevant: ["New phone, who dis?", "You still owe me from 2019.", "Venmo or Cash App?", "I'm on a budget.", "My bank account is crying right now.", "Blocked.", "That sounds like a you problem.", "Is this a scam?", "I'm currently in witness protection.", "lol wrong person sorry", "Before I reply, you should know I'm 9.", "I'm going to need you to never contact me again.", "Per my last text..."]
  },
  {
    message: "I think I'm in love with your sibling.",
    relevant: ["You're dead to me.", "Which one?", "That is no way to talk to your best friend.", "I'm telling your mom.", "We're done here.", "I'm forwarding this to your mother.", "This is actually his wife.", "I just threw up a little.", "My therapist warned me about people like you.", "I'm not surprised, just disappointed.", "I'm going to need you to never contact me again.", "I have a restraining order against you."]
  },
  {
    message: "It's Fridayyyy! You know what that means.",
    relevant: ["I'm literally hiding in the bathroom, please send help.", "I'm already in bed.", "Are you drunk?", "I'm on my way! 🏃‍♂️💨", "Leave me alone.", "I have diarrhea.", "I'm too sober for this.", "I'm in a meeting.", "I'm currently in witness protection.", "Crocs and socks.", "Khakis.", "I'm going through something."]
  },
  {
    message: "Can you come pick me up? I'm stranded.",
    relevant: ["That sounds like a you problem.", "Send me your location.", "I'm currently in a high-speed chase, can I call you back?", "Call an Uber.", "How did you even get there?", "I'm in a meeting.", "I have diarrhea.", "I'm currently being held hostage, please send help.", "I'm on a budget.", "That is no way to talk to your Uber driver.", "Again?", "I'm going through something."]
  },
  {
    message: "I'm shaving my head right now.",
    relevant: ["Pics or it didn't happen.", "Are you drunk?", "Don't.", "I'm literally crying right now 😂", "Your mom is gonna kill you.", "Stop eating edibles.", "I'm not even mad, I'm impressed.", "I'm too sober for this.", "Was it worth it?", "I'm going through something.", "Bold of you to assume I care.", "Time to fake your death."]
  },

  // --- DATING / FLIRTING ---
  {
    message: "What are you wearing?",
    relevant: ["Khakis.", "Sir, this is a Wendy's.", "A smile and nothing else.", "I'm calling the police.", "Crocs and socks.", "Before I reply, you should know I'm 9.", "I have a restraining order against you.", "This is actually her husband.", "This conversation is being recorded.", "Grandma, did you send this to the wrong person again?", "I'm calling HR.", "That is no way to talk to your Uber driver."]
  },
  {
    message: "I had a dream about you last night.",
    relevant: ["Was I rich?", "That is no way to talk to your dentist.", "I'm calling the police.", "I'm flattered and also concerned.", "New phone, who dis?", "Before I reply, you should know I'm 9.", "I have a restraining order against you.", "My therapist warned me about people like you.", "This is actually his wife.", "I just threw up a little.", "Please refer all complaints to my therapist.", "That's between you and God."]
  },
  {
    message: "My ex just texted me.",
    relevant: ["Block them immediately.", "What did they say?", "Here we go again.", "That sounds like a you problem.", "Don't you dare reply.", "I already screenshotted this.", "Delivered ✓✓ (but choosing not to respond)", "Time to fake your death.", "I'm not surprised, just disappointed.", "This is why we can't have nice things.", "I'm going through something.", "Delete my number."]
  },
  {
    message: "I swiped right on your mom.",
    relevant: ["You're dead to me.", "She swiped left.", "That is no way to talk to your friend.", "I'm telling your dad.", "We're done here.", "I'm literally at your mom's house right now.", "I'm forwarding this to your mother.", "I just threw up a little.", "My therapist warned me about people like you.", "I have a restraining order against you.", "I'm going to need you to never contact me again.", "This is actually her husband."]
  },

  // --- FAMILY ---
  {
    message: "Your dad just added me on Snapchat.",
    relevant: ["Block him immediately.", "He's going through a phase.", "I'm literally shaking rn.", "Don't open his snaps.", "That is no way to talk to your friend.", "I'm forwarding this to your mother.", "This conversation is being recorded.", "I just threw up a little.", "My therapist warned me about people like you.", "I'm not surprised, just disappointed.", "This is why we can't have nice things.", "I'm dead. 💀"]
  },
  {
    message: "Grandma just learned how to use emojis.",
    relevant: ["God help us all.", "Which emoji is she using the most?", "I'm literally crying right now 😂", "Time to change the Wi-Fi password.", "Thoughts and prayers 🙏", "I'm not even mad, I'm impressed.", "This is why we can't have nice things.", "I'll pray for you.", "Make it stop.", "We're done here.", "Sorry, my parrot typed that.", "Before I reply, you should know I'm 9."]
  },
  {
    message: "I just found out I'm adopted.",
    relevant: ["Lucky.", "That sounds like a you problem.", "Same, honestly.", "Your mom is gonna— wait, which mom?", "I'm literally shaking rn.", "Before I reply, you should know I'm 9.", "I'm not surprised, just disappointed.", "That's between you and God.", "I already know.", "Which one?", "I'm going through something.", "I'll pray for you."]
  },

  // --- CONFESSIONS ---
  {
    message: "I have a confession to make...",
    relevant: ["I'm not ready for this.", "Sir, this is a Wendy's.", "Save it for your therapist.", "My lawyer will be in touch.", "I already know.", "This conversation is being recorded.", "I'm forwarding this to your mother.", "Before I reply, you should know I'm 9.", "I already screenshotted this.", "Please refer all complaints to my therapist.", "That's between you and God.", "Bold of you to assume I care."]
  },
  {
    message: "I've been lying to you about something.",
    relevant: ["I knew it.", "Was it about the leftovers?", "I'm literally shaking rn.", "My lawyer will be in touch.", "We're done here.", "This conversation is being recorded.", "I already know.", "I'm not surprised, just disappointed.", "Which one?", "I'm going to need you to never contact me again.", "I already screenshotted this.", "Your secret is safe with me and everyone in the group chat."]
  },
  {
    message: "Don't tell anyone, but...",
    relevant: ["I already screenshotted this.", "Your secret is safe with me and everyone in the group chat.", "I'm listening...", "I'm telling your mom.", "My lawyer will be in touch.", "This conversation is being recorded.", "I just showed this to everyone at work.", "I'm forwarding this to your mother.", "Before I reply, you should know I'm 9.", "I already know.", "Bold of you to assume I care.", "Per my last text..."]
  },

  // --- RANDOM / WILD ---
  {
    message: "I just dropped my phone in the toilet.",
    relevant: ["That sounds like a you problem.", "Is that why this text smells weird?", "Thoughts and prayers 🙏", "Put it in rice.", "Can I have your old number?", "Again?", "This is why we can't have nice things.", "I'm not even mad, I'm impressed.", "Was it worth it?", "I'm dead. 💀", "I'm going through something.", "God has a plan."]
  },
  {
    message: "What is your Netflix password again?",
    relevant: ["We broke up 3 years ago.", "New phone, who dis?", "Blocked.", "It's 'GetYourOwnAccount123'.", "My lawyer will be in touch.", "You still owe me from 2019.", "I'm on a budget.", "Per my last text...", "I'm going to need you to never contact me again.", "Bold of you to assume I care.", "Is this a scam?", "Delivered ✓✓ (but choosing not to respond)"]
  },
  {
    message: "Hey, are you still coming to the party tonight?",
    relevant: ["I'm already in bed.", "Depends. Will your ex be there?", "I'm currently in witness protection.", "Only if there's free food.", "I'm literally hiding in the bathroom, please send help.", "I have diarrhea.", "I'm in a meeting.", "Crocs and socks.", "I'm going through something.", "I'm too sober for this.", "I'm currently being held hostage, please send help.", "lol wrong person sorry"]
  },
  {
    message: "Did you really just do that?",
    relevant: ["No regrets.", "Pics or it didn't happen.", "I blacked out, what happened?", "That sounds like a me problem.", "I'd do it again.", "I'm not even mad, I'm impressed.", "Was it worth it?", "Sorry, my parrot typed that.", "That was a different me.", "This message has been deleted.", "I'm going through something.", "Bold of you to assume I care."]
  },
  {
    message: "Why did you send me a picture of a raw potato?",
    relevant: ["It's a selfie.", "I thought it was inspirational.", "Wrong chat.", "That is no way to talk to your chef.", "I'm going through something.", "Sorry, my parrot typed that.", "I blacked out, what happened?", "I'm not even mad, I'm impressed.", "That was a different me.", "This message has been deleted.", "lol wrong person sorry", "Stop eating edibles."]
  },
  {
    message: "Can you send me a pic of your dog?",
    relevant: ["I don't have a dog.", "Only if you say please.", "He's camera shy.", "That'll cost you.", "Which angle?", "I'm in a meeting.", "Before I reply, you should know I'm 9.", "Sir, this is a Wendy's.", "Pics or it didn't happen.", "I'm calling the police.", "This is actually her husband.", "I'm on a budget."]
  },
  {
    message: "I know what you did last summer.",
    relevant: ["Which part?", "I'm calling my lawyer.", "That was a different me.", "Prove it.", "I know what YOU did last summer.", "This conversation is being recorded.", "I'm currently in witness protection.", "My therapist warned me about people like you.", "I'm not at liberty to discuss that.", "Before I reply, you should know I'm 9.", "I have a restraining order against you.", "I already screenshotted this."]
  }
];

// ==========================================
// REPLY CARDS (General Wildcards Pool)
// ==========================================
const generalReplies = [
  // CLASSICS
  "New phone, who dis?",
  "That sounds like a you problem.",
  "I'm literally crying right now 😂",
  "Sir, this is a Wendy's.",
  "I'll pretend I didn't see that.",
  "I'm on my way! 🏃‍♂️💨",
  "Delete my number.",
  "I'm telling your mom.",
  "Pics or it didn't happen.",
  "I'd rather eat glass.",
  "K.",
  "Same.",
  "That's what she said.",
  "I'm calling the police.",
  "You're paying for my therapy.",
  "We're done here.",
  "I love you too.",
  "Who is this?",
  "Are you drunk?",
  "Blocked.",
  "Thoughts and prayers 🙏",
  "Cool story bro.",
  "I need an adult.",
  "Let's never speak of this again.",
  "My lawyer will be in touch.",
  "Oof.",
  "Unsubscribe.",

  // AUTHENTIC STYLE
  "That is no way to talk to your father.",
  "That is no way to talk to your mother.",
  "Grandma, did you send this to the wrong person again?",
  "I'm currently hiding in the bathroom, please send help.",
  "My bank account is crying right now.",
  "I don't know but will I need my inhaler?",
  "I've already eaten all the snacks, sorry.",
  "I'm literally shaking rn.",
  "Your mom is gonna kill you.",
  "Time to fake your death.",
  "My FBI agent already saw it.",
  "I'm calling HR.",
  "God has a plan.",
  "Congratulations! Is it mine?",
  "I'm not at liberty to discuss that.",
  "I blacked out, what happened?",
  "Venmo or Cash App?",
  "Wrong chat.",
  "Put it in rice.",
  "I already screenshotted this.",

  // CHAOTIC WILDCARDS
  "I'm going through something.",
  "You need Jesus.",
  "Is this a threat?",
  "I have diarrhea.",
  "Don't text me.",
  "This is why we can't have nice things.",
  "Make it stop.",
  "I'm dead. 💀",
  "Aight, I'ma head out.",
  "No.",
  "Please refer all complaints to my therapist.",
  "I'm in a meeting.",
  "Read 4:37 PM.",
  "That was a different me.",
  "Finally.",
  "Crocs and socks.",
  "Which one?",
  "Again?",
  "You still owe me from 2019.",
  "Khakis.",
  "I'm flattered and also concerned.",
  "Here we go again.",
  "Leave me alone.",
  "Only if you say please.",
  "How did you even get there?",
  "I already know.",
  "Prove it.",
  "Was it worth it?",
  "Can I have your Xbox?",
  "I'm on a budget.",
  "Stop eating edibles.",

  // ICONIC REAL GAME CARDS
  "Before I reply, you should know I'm 9.",
  "This is actually his wife.",
  "This is actually her husband.",
  "Grandma, did you forget to take your pills today?",
  "I have a restraining order against you.",
  "I'm currently in a high-speed chase, can I call you back?",
  "I'm currently in witness protection.",
  "Wrong person. But also, yes.",
  "I just showed this to everyone at work.",
  "I'm forwarding this to your mother.",
  "Sorry, my parrot typed that.",
  "I'm not even mad, I'm impressed.",
  "That's between you and God.",
  "I'm at your front door.",
  "I'm sitting right next to you.",
  "This conversation is being recorded.",
  "I'm literally at your mom's house right now.",
  "I just threw up a little.",
  "I'm too sober for this.",
  "I'm going to need you to never contact me again.",
  "lol wrong person sorry",
  "Delivered ✓✓ (but choosing not to respond)",
  "This message has been deleted.",
  "Per my last text...",
  "I'm in the emergency room, but go on.",
  "That is no way to talk to your dentist.",
  "That is no way to talk to your Uber driver.",
  "Noted. Anyway, what's for dinner?",
  "I'll pray for you.",
  "My therapist warned me about people like you.",
  "I'm not surprised, just disappointed.",
  "I've seen your search history, you can't judge me.",
  "Bold of you to assume I care.",
  "I'm currently being held hostage, please send help.",
  "Your secret is safe with me and everyone in the group chat."
];

// Extract just the message strings for deck shuffling
const inboxCards = inboxData.map(d => d.message);

module.exports = { inboxCards, inboxData, generalReplies };
