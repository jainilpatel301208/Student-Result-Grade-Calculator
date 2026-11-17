
const form = document.getElementById("resultForm");
const resetBtn = document.getElementById("resetBtn");
const nameInput = document.getElementById("studentName");
const markInputs = document.querySelectorAll(".mark");
const resultCard = document.getElementById("resultCard");

const NUM_SUBJECTS = 5;
const MAX_MARKS_PER_SUBJECT = 100;
const SUBJECT_PASS_MARK = 35;
const OVERALL_PASS_PERCENT = 40;

// Show or clear an error message under a field
function setError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
}

// Validate the student name
function validateName() {
  if (nameInput.value.trim() === "") {
    setError(nameInput, "Please enter the student's name.");
    return false;
  }
  setError(nameInput, "");
  return true;
}

// Validate a single mark: must be a number between 0 and 100
function validateMark(input) {
  const value = input.value.trim();

  if (value === "") {
    setError(input, "Please enter marks for this subject.");
    return false;
  }
  if (isNaN(Number(value))) {
    setError(input, "Marks must be a number (digits only).");
    return false;
  }
  const num = Number(value);
  if (num < 0 || num > 100) {
    setError(input, "Marks must be between 0 and 100.");
    return false;
  }
  setError(input, "");
  return true;
}

// Conditional rules for grade based on percentage
function getGrade(percentage) {
  if (percentage >= 90) {
    return "A+";
  } else if (percentage >= 80) {
    return "A";
  } else if (percentage >= 70) {
    return "B";
  } else if (percentage >= 60) {
    return "C";
  } else if (percentage >= 50) {
    return "D";
  } else if (percentage >= 40) {
    return "E";
  } else {
    return "F";
  }
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let allValid = validateName();
  markInputs.forEach(function (input) {
    if (!validateMark(input)) {
      allValid = false;
    }
  });

  if (!allValid) {
    resultCard.classList.add("hidden");
    return;
  }

  // Calculations
  let total = 0;
  let failedSubject = false;
  markInputs.forEach(function (input) {
    const mark = Number(input.value.trim());
    total += mark;
    if (mark < SUBJECT_PASS_MARK) {
      failedSubject = true;
    }
  });

  const percentage = (total / (NUM_SUBJECTS * MAX_MARKS_PER_SUBJECT)) * 100;
  const average = total / NUM_SUBJECTS;

  const passed = !failedSubject && percentage >= OVERALL_PASS_PERCENT;
  const grade = passed ? getGrade(percentage) : "F";

  // Update the result card
  document.getElementById("resName").textContent = "Student: " + nameInput.value.trim();
  document.getElementById("resTotal").textContent = total + " / " + (NUM_SUBJECTS * MAX_MARKS_PER_SUBJECT);
  document.getElementById("resPercent").textContent = percentage.toFixed(2) + "%";
  document.getElementById("resAverage").textContent = average.toFixed(2);
  document.getElementById("resGrade").textContent = grade;

  const statusEl = document.getElementById("resStatus");
  if (passed) {
    statusEl.textContent = "Status: PASS";
  } else if (failedSubject) {
    statusEl.textContent = "Status: FAIL (scored below " + SUBJECT_PASS_MARK + " in at least one subject)";
  } else {
    statusEl.textContent = "Status: FAIL (overall percentage below " + OVERALL_PASS_PERCENT + "%)";
  }

  resultCard.classList.toggle("fail", !passed);
  resultCard.classList.remove("hidden");
});

// Reset button: clear inputs, errors and result card
resetBtn.addEventListener("click", function () {
  form.reset();
  setError(nameInput, "");
  markInputs.forEach(function (input) {
    setError(input, "");
  });
  resultCard.classList.add("hidden");
  resultCard.classList.remove("fail");
});